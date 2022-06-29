import {React, useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import CustomFormInput from  '../../shared/CustomFormInput/CustomFormInput'
import CustomFormSelect from '../../shared/CustomFormSelect/CustomFormSelect'
import RentPriceAdornmentGroup from '../components/RentPriceAdornmentGroup'
import CustomFormMultipleSelect from '../../shared/CustomFormMultipleSelect/CustomFormMultipleSelect'
import CustomImageUploader from '../../shared/CustomImageUploader/CustomImageUploader'
import Button from 'react-bootstrap/Button'
import { Modal, Space } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

const ProductListing = () => {
  const [itemCategoriesResponse, setItemCategoriesResponse] = useState(null)
  const [deliveryOptionsResponse, setDeliveryOptionsResponse] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const methods = useForm()
  let navigate = useNavigate();

  const handleUnnecessaryFromAntD = (itemPictures) => {
    let index = itemPictures.findIndex(picture => !picture.uid.includes('base64'))
    //console.log(index)
    itemPictures.splice(index, 1)
    return itemPictures
  }

  const handleb64toBlob = async (URLs) =>{
    return Promise.all(URLs.map(url => fetch(url)))
          .then(responses => Promise.all(responses.map(response => response.blob())))
  }

  const handleBlobtoFile = (blobArray, fileName) =>{
    let name = fileName
    let fileArray = []
    name = name.split(/[\s]+/).join("-");
    blobArray.forEach((blob, index) => {
      fileArray.push(new File([blob], name + '-' + uuidv4() + '.jpg', { type: 'image/jpeg' }))
    })

    return fileArray
  }

  const handleItemSubmit = async (data, e) => {
    e.preventDefault()

    console.log('SUBMITTED ITEM INFO')
    console.log(data)

    //making sure all images are in base64 format
    const handledPictureArray = handleUnnecessaryFromAntD(data.itemPictures)
    
    //converting base64 to BLOB
    let URLs = []
    for(var i = 0; i < handledPictureArray.length; i++){
      URLs.push(handledPictureArray[i].url)
    }
    const blobArray = await handleb64toBlob(URLs)

    //converting blob to File
    const fileArray = handleBlobtoFile(blobArray, data.itemName)

    let newData = data
    delete newData.itemPictures

    let auth_token = localStorage.getItem('token')

    const POST_URL = 'http://localhost:5000/api/items' //POST
    let formData = new FormData()
    formData.append('itemName', data.itemName)
    formData.append('itemDescription', data.itemDescription)
    formData.append('itemCategory', data.itemCategory)
    formData.append('itemDeliveryOptions', data.deliveryOptions)
    formData.append('itemMinimumRentDuration', data.itemMinimumRentDuration)
    formData.append('itemWeight', data.itemWeight)
    formData.append('itemRentPerDay', data.productRentPerDay)
    formData.append('itemRentPerWeek', data.productRentPerWeek)
    formData.append('itemRentPerMonth', data.productRentPerMonth)
    Array.from(fileArray).forEach(file => {
      formData.append('itemPictures', file)
    })
    axios({
        method: 'post',
        url: POST_URL,
        data: formData,
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": auth_token
        }
     }).then(response => {
       console.log('item created successfully')
        if(response.status === 201){
          Modal.success({
            content: 'Barang kamu berhasil terdaftar!',
            onOk: () => {
              window.location.reload()
            }
          });
        }
     }).catch(error => {
        console.log(error)
        if(error.response.data.status === 'ITEM_EXIST'){
         Modal.error({
           content: 'Barang yang kamu daftarkan sudah ada!',
           onOk: () => {
             document.location.reload()
           }
         })
        }
        if(error.response.data.status === 'ITEM_CANNOT_BE_CREATED'){
         Modal.error({
           content: 'Barang yang kamu daftarkan tidak dapat dibuat! Coba lagi!',
           onOk: () => {
            document.location.reload()
          }
         })
        }
      })
  }

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
  
  useEffect(() => {

    const filterSelections_api_URL = [
      'http://localhost:5000/api/items/item-categories',
      'http://localhost:5000/api/delivery-options'
    ]

    console.log('fetching category and delivery option list')
    const fetchFilterSelections_api_URL = async () => {
      axios.all(filterSelections_api_URL.map((url) => axios.get(url))).then(
        axios.spread((itemCategories, deliveryOptions) => {
          setItemCategoriesResponse(itemCategories.data)
          setDeliveryOptionsResponse(deliveryOptions.data)
        })
      )
    }
    fetchFilterSelections_api_URL()
  }, [])

 
  return (
    <Container className="mt-3 pb-5">
        <h3>Daftar Listing Barang</h3>
        <FormProvider {...methods}>
          <Form encType='multipart/form-data' onSubmit = {methods.handleSubmit(handleItemSubmit, handleError)}>
            <div className="image-listing-upload-wrapper">
              {/* uncontrolled by React Hook Form. */}
              <CustomImageUploader inputName="itemPictures"
                // setItemPictures = {setItemPictures} 
              />
            </div>

              {/* Controlled by React Hook Form */}
            <div className="text-listing-upload-wrapper">
              <CustomFormInput 
                  inputType="text" 
                  inputPlaceholder="Nama Barang" 
                  inputLabel="Nama Barang"
                  inputName="itemName" 
                  inputId="item-name" 
                  inputAs="text"
                  inputValidation={productListingValidations.itemName}

              />

              <CustomFormSelect
                  selectOptions={itemCategoriesResponse}
                  selectLabel="Kategori Barang"
                  selectName="itemCategory"
                  selectValidation = {productListingValidations.itemCategory}
              />
              
              <CustomFormInput 
                  inputType="text" 
                  inputPlaceholder="Deskripsi Barang" 
                  inputLabel="Deskripsi Barang" 
                  inputId="item-description"
                  inputName="itemDescription" 
                  inputAs="textarea"
                  inputValidation={productListingValidations.itemDescription}
              />

              <RentPriceAdornmentGroup 
                inputValidation={productListingValidations.itemRentPrice}
              /> 

              <CustomFormInput
                inputType="text"
                inputPlaceHolder="Durasi Peminjaman Minimum (hari)"
                inputLabel="Durasi Peminjaman Minimum (hari)"
                inputId="item-minimum-rent-duration"
                inputName="itemMinimumRentDuration"
                inputAs="text"
                inputValidation={productListingValidations.itemMinimumRentDuration}
              />

              <CustomFormInput
                inputType="text"
                inputPlaceHolder="Berat Barang"
                inputLabel="Berat Barang (gram)"
                inputId="itemWeight"
                inputName="itemWeight"
                inputAs="text"
                inputValidation={productListingValidations.itemWeight}
              />

              <CustomFormMultipleSelect
                selectOptions={deliveryOptionsResponse}
                selectLabel="Opsi Pengiriman Barang"
                selectName="deliveryOptions"
                selectValidation={productListingValidations.deliveryOptions}
              /> 
            </div>
              <Button type="submit" style={{width: '100%'}} className="primary-button">
                Daftar
              </Button>
          </Form>
        </FormProvider>
    </Container>
  )
}

export default ProductListing