import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';

function ItemImages(props) {
    const [Images, setImages] = useState([])

    useEffect(() => {
        if(process.env.REACT_APP_IS_IMAGE_FROM_CLOUDINARY === 'true'){
            let images = [];
            props.detail.ItemPictureURLs.forEach(item => {
                images.push({
                    original: item.secure_url,
                    thumbnail: item.secure_url
                })
            })
            setImages(images)
        }
        else{
            if (props.detail.ItemPictureLocalPaths && props.detail.ItemPictureLocalPaths.length > 0) {
                let images = [];
                props.detail.ItemPictureLocalPaths && props.detail.ItemPictureLocalPaths.map(item => {
                    images.push({
                        original: `http://localhost:3000/${item}`,
                        thumbnail: `http://localhost:3000/${item}`
                    })
                })
                setImages(images)
            }
        }
    }, [props.detail])

    return (
        <div>
            <ImageGallery 
                items={Images} 
                thumbnailPosition={"right"} 
                lazyLoad={true} 
                showIndex 
                useBrowserFullscreen={false} 
                showPlayButton={false}
            />
        </div>
    )
}

export default ItemImages
