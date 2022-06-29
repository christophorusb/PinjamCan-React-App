import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';

function ItemImages(props) {
    const [Images, setImages] = useState([])

    useEffect(() => {
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
