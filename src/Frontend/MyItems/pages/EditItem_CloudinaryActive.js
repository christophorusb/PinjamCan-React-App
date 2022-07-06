import { React, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import { useForm, FormProvider } from 'react-hook-form'
import CustomUpdateFormInput from  '../../shared/CustomUpdateFormInput/CustomUpdateFormInput'
import CustomUpdateFormSelect from '../../shared/CustomUpdateFormSelect/CustomUpdateFormSelect'
import UpdateRentPriceAdornmentGroup from '../components/UpdateRentPriceAdornmentGroup'
import CustomUpdateFormMultipleSelect from '../../shared/CustomUpdateFormMultipleSelect/CustomUpdateFormMultipleSelect'
import CustomUpdateImageUploader from '../../shared/CustomUpdateImageUploader/CustomUpdateImageUploader'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Modal as AntdModal, message } from 'antd'
import { nanoid } from 'nanoid'
import axios from 'axios'

const EditItem_CloudinaryActive = () => {
    const { itemId } = useParams()
    const [item, setItem] = useState({})
    const [itemCategories, setItemCategories] = useState([])
    const [deliveryOptions, setDeliveryOptions] = useState([])
    const [areURLsFetched, setAreURLsFetched] = useState(false)
    const methods = useForm()
    let navigate = useNavigate();

    const handleError = (errors) => {}
    const productListingValidations = {
        itemPicture: {
          required: 'Upload setidaknya satu foto!'
        },
    
        itemName: {
          required: "Nama barang tidak boleh kosong!",
          minLength:{
            value: 3,
            message: 'Nama barang harus lebih dari 3 karakter!'
          },
        },
    
        itemCategory: {
          required: "Kategori barang tidak boleh kosong!",
        },
    
        itemDescription: {
          required: "Deskripsi barang tidak boleh kosong!",
          minLength: {
            value: 8,
            message: 'Deskripsi barang harus lebih dari 8 karakter!'
          }
        },
    
        itemMinimumRentDuration: {
          required: "Durasi peminjaman minimum tidak boleh kosong!",
          pattern: {
            value: /^[0-9]*$/,
            message: 'Input harus berupa angka!'
          }
        },
    
        itemRentPrice: {
          required: 'Harga peminjaman tidak boleh kosong!',
        },
    
        itemWeight: {
          required: "Berat barang tidak boleh kosongi!",
          pattern: {
            value: /^[0-9]*$/,
            message: 'Input harus berupa angka!'
          }
        },
    
        deliveryOptions: {
          required: "Opsi pengiriman tidak boleh kosong!",
        }
      }

    const handleUnnecessaryFromAntD = (itemPictures) => {
      //console.log('HANDLE FROM ANTD')
      let parsedArray = JSON.parse(itemPictures)
      //console.log(JSON.parse(itemPictures))
     // console.log(parsedArray)
      let index = parsedArray.findIndex(picture => !picture.uid.includes('update'))
     // console.log(index)
      if(index !== -1){ //found
        parsedArray.splice(index, 1)
       // console.log(parsedArray)

        return parsedArray
      }
      else{
        return JSON.parse(itemPictures)
      }
    }

    const handleNewAndExistingImgSeparation = (itemPictures) => {
      //console.log(itemPictures)
        let existingImgs = []
        let newImgs = []

        itemPictures.forEach(picture => {
            if(picture.uid.includes('update_origin')){
                existingImgs.push(picture.url)
            }
            if(picture.uid.includes('base64')){
                newImgs.push(picture.url)
            }
        })
        const separated = {
            existingImages: existingImgs,
            newImages: newImgs
        }
        return separated
    }

    const handleItemUpdate = (data, e) => {
        e.preventDefault()
        console.log('SUBMITTED DATA')
        console.log(JSON.stringify(data.itemPictures))
        let promisedPictures = JSON.stringify(data.itemPictures)

        const hide = message.loading({ content: <strong className="secondary-font-color">Sedang mengupload...</strong>, duration: 0})
        const handledPictureArray =  handleUnnecessaryFromAntD(promisedPictures)
        //console.log(handledPictureArray)

        const newAndExistingImgSeparated = handleNewAndExistingImgSeparation(handledPictureArray)
        //console.log(newAndExistingImgSeparated)

        const existingImgsOriginal = item.ItemPictureURLs
        //console.log(item.ItemPictureURLs)
        let newData
        let imagesToBeDeleted = {}
        let publicIdsToBeDeleted = []
        let URLsToBeDeleted = []

        for(let i = 0; i < existingImgsOriginal.length; i++){
          if(newAndExistingImgSeparated.existingImages.includes(existingImgsOriginal[i].url) === false){
            publicIdsToBeDeleted.push('image_user_uploads/' + existingImgsOriginal[i].name)
            URLsToBeDeleted.push(existingImgsOriginal[i].url)
          }
        }
        imagesToBeDeleted = {
          public_ids: publicIdsToBeDeleted,
          URLs: URLsToBeDeleted
        }
        // console.log('IMAGES TO BE DELETED')
        console.log(imagesToBeDeleted)
 
        let thisData = data
        delete thisData.itemPictures

        let itemPictures = newAndExistingImgSeparated.newImages.length !== 0 ? newAndExistingImgSeparated.newImages : null
        let itemPictures_nameAdded = []

        if(itemPictures !== null){
            itemPictures.forEach(picture => {
              const id = nanoid().replaceAll('-', '_')
              const name = data.itemName.replaceAll(' ', '_') + '-' + id
              const addName = {
                img_base64: picture,
                img_name: name
              }

              itemPictures_nameAdded.push(addName)
            })
        }

        if(itemPictures_nameAdded.length !== 0){
          newData = { ...thisData, itemPictures: itemPictures_nameAdded, }
          if(Object.keys(imagesToBeDeleted).length !== 0){
            newData.imagesToBeDeleted = imagesToBeDeleted
          }
          else{
            newData.imagesToBeDeleted = null
          }
        }
        else{
          newData = { ...thisData, itemPictures: null, }
          if(Object.keys(imagesToBeDeleted).length !== 0){
            newData.imagesToBeDeleted = imagesToBeDeleted
          }
          else{
            newData.imagesToBeDeleted = null
          }
        }

        
        console.log(newData)

        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_URL_TO_BACKEND}/api/items/image-cloudinary/${itemId}`,
            data: newData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            hide()
            if(res.status === 200){
                AntdModal.success({
                    title: 'Barang berhasil diperbarui!',
                    onOk: () => {
                        window.location.href = '/my-items'
                    }
                })
            }
        })
    }

    useEffect(() => {
      const URLs = [
        `${process.env.REACT_APP_URL_TO_BACKEND}/api/items/${itemId}`,
        `${process.env.REACT_APP_URL_TO_BACKEND}/api/items/item-categories`,
        `${process.env.REACT_APP_URL_TO_BACKEND}/api/delivery-options`
      ]

      const fetchData = async () => {
        axios.all(URLs.map((url) => axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }))).then(
                axios.spread((item, itemCategories, deliveryOptions) => {
                    let fileList = []
                    item.data.dataResponse.ItemPictureURLs.forEach(URL => {
                        fileList.push(
                            {
                                uid: 'update_origin' + '-' + nanoid().replaceAll('-', '_'),
                                name: URL.secure_url.split('/').pop().split('.')[0],
                                status: 'done',
                                url: URL.secure_url
                            }
                        )
                    })
                    const updatedItemInfo = {
                        ...item.data.dataResponse,
                        ItemPictureURLs: fileList,
                    }
                    setItem(updatedItemInfo)
                    setItemCategories(itemCategories.data)
                    setDeliveryOptions(deliveryOptions.data)
                }
            )
        )
      }

        fetchData().then(() => {
            setAreURLsFetched(true)
        })
    }, [])

    if(areURLsFetched === false){
        console.log(areURLsFetched)
        return <CustomCircularLoading />
    }
    else{
      //console.log(item)
        return (
            <Container className="pb-5">
                <h3 className="primary-font-color">Edit Barang</h3>
                <FormProvider {...methods}>
                  <Form onSubmit = {methods.handleSubmit(handleItemUpdate, handleError)}>
                    <div className="image-listing-upload-wrapper">
                      {/* uncontrolled by React Hook Form. */}
                      <CustomUpdateImageUploader 
                        inputName="itemPictures" 
                        existingImgs={Object.keys(item).length === 0 ? [] : item.ItemPictureURLs}
                        //existingImgs={item.ItemPictureURLs}
                      />
                    </div>
        
                      {/* Controlled by React Hook Form */}
                    <div className="text-listing-upload-wrapper">
                      <CustomUpdateFormInput 
                          inputType="text" 
                          inputPlaceholder="Nama Barang" 
                          inputLabel="Nama Barang"
                          inputName="itemName" 
                          inputId="item-name" 
                          inputAs="text"
                          inputValidation={productListingValidations.itemName}
                          existingValue={Object.keys(item).length === 0 ? 'NONE' : item.ItemName}
                      />
        
                      <CustomUpdateFormSelect
                          selectOptions={itemCategories}
                          selectLabel="Kategori Barang"
                          selectName="itemCategory"
                          selectValidation = {productListingValidations.itemCategory}
                          existingValue={Object.keys(item).length === 0 ? 'NONE' : item.ItemCategory}
                      />
                      
                      <CustomUpdateFormInput 
                          inputType="text" 
                          inputPlaceholder="Deskripsi Barang" 
                          inputLabel="Deskripsi Barang" 
                          inputId="item-description"
                          inputName="itemDescription" 
                          inputAs="textarea"
                          inputValidation={productListingValidations.itemDescription}
                          existingValue={Object.keys(item).length === 0 ? 'NONE' : item.ItemDescription}
                      />
        
                      <UpdateRentPriceAdornmentGroup 
                        inputValidation={productListingValidations.itemRentPrice}
                        existingValues={Object.keys(item).length === 0 ? 'NONE' : {daily: item.ItemPriceDaily, weekly: item.ItemPriceWeeklyPerDay*7, monthly: item.ItemPriceMonthlyPerDay*30}}
                      /> 
        
                      <CustomUpdateFormInput
                        inputType="text"
                        inputPlaceHolder="Durasi Peminjaman Minimum (hari)"
                        inputLabel="Durasi Peminjaman Minimum (hari)"
                        inputId="item-minimum-rent-duration"
                        inputName="itemMinimumRentDuration"
                        inputAs="text"
                        inputValidation={productListingValidations.itemMinimumRentDuration}
                        existingValue={Object.keys(item).length === 0 ? 'NONE' : item.ItemMinimumRentDuration}
                      />
        
                      <CustomUpdateFormInput
                        inputType="text"
                        inputPlaceHolder="Berat Barang"
                        inputLabel="Berat Barang (gram)"
                        inputId="itemWeight"
                        inputName="itemWeight"
                        inputAs="text"
                        inputValidation={productListingValidations.itemWeight}
                        existingValue={Object.keys(item).length === 0 ? 'NONE' : item.ItemWeight}
                      />
        
                      <CustomUpdateFormMultipleSelect
                        selectOptions={deliveryOptions}
                        selectLabel="Opsi Pengiriman Barang"
                        selectName="itemDeliveryOptions"
                        selectValidation={productListingValidations.deliveryOptions}
                        existingValues={Object.keys(item).length === 0 ? 'NONE' : item.ItemDeliveryOptions}
                      /> 
                    </div>
                      <Button type="submit" style={{width: '100%'}} className="primary-button">
                        Edit
                      </Button>
                  </Form>
                </FormProvider>
            </Container>
          )
    }
}

export default EditItem_CloudinaryActive