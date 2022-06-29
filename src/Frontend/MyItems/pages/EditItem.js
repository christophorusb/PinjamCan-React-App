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
import { Modal as AntdModal } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const EditItem = () => {
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
        let index = itemPictures.findIndex(picture => !picture.uid.includes('update'))
        //console.log(index)
        itemPictures.splice(index, 1)
        return itemPictures
    }

    const handleNewAndExistingImgSeparation = (itemPictures) => {
        let existingImgs = []
        let newImgs = []

        itemPictures.forEach(picture => {
            if(picture.uid.includes('origin')){
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

    const handleb64toBlob = async (URLs) =>{
        return Promise.all(URLs.map(url => fetch(url)))
                .then(responses => Promise.all(responses.map(response => response.blob())))
    }

    const handleBlobToFile = (blobArray, fileName) => {
        let name = fileName.split(/[\s]+/).join("-");
        let fileArray = []
        blobArray.forEach((blob, index) => {
            fileArray.push(new File([blob], name + '-' + uuidv4() + '.jpg', { type: 'image/jpeg' }))
        })

        return fileArray
    }

    const handleFetchImgFromPublicFolder = async (paths, fileName) => {
        const response = await Promise.all(paths.map(path => fetch(path)))
        const blobs = await Promise.all(response.map(res => res.blob()))
        const files = handleBlobToFile(blobs, fileName)
        
        return files
    }

    const handleConversions = async (separated, data) => {
        let converted = []
        //console.log(separated)
        if(separated.newImages.length > 0){ //base64 URL
            const toBlobs = await handleb64toBlob(separated.newImages)
            const toFiles = handleBlobToFile(toBlobs, data.itemName)
            converted = [...converted, ...toFiles]
        } 
        if(separated.existingImages.length > 0){ //URL to img path
            const toFiles = await handleFetchImgFromPublicFolder(separated.existingImages, data.itemName)
            console.log(toFiles)
            converted = [...converted, ...toFiles]
        }
        return converted
    }

    const handleItemUpdate = async (data, e) => {
        e.preventDefault()
        console.log(e)
        console.log(data)
        const handledPictureArray = handleUnnecessaryFromAntD(data.itemPictures)
        const newAndExistingImgSeparated = handleNewAndExistingImgSeparation(handledPictureArray)
        const convertedIntoFiles = await handleConversions(newAndExistingImgSeparated, data)

        let newData = data
        delete newData.itemPictures

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
        
        convertedIntoFiles.forEach(file => {
            formData.append('itemPictures', file)
        })

        for(let [key, val] of formData){
            console.log(`${key}: ${val}`)
        }

        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/items/${itemId}`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res)
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
        `http://localhost:5000/api/items/${itemId}`,
        'http://localhost:5000/api/items/item-categories',
        'http://localhost:5000/api/delivery-options'
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
                    item.data.dataResponse.ItemPictureLocalPaths.forEach(path => {
                        fileList.push(
                            {
                                uid: 'update-origin-'+uuidv4(),
                                name: path.split('/').pop(),
                                status: 'done',
                                url: path
                            }
                        )
                    })
                    const updatedItemInfo = {
                        ...item.data.dataResponse,
                        ItemPictureLocalPaths: fileList,
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
        // console.log(item)
        // console.log(Object.keys(item).length === 0 ? '' : item.dataResponse.ItemCategory)
        return (
            <Container className="pb-5">
                <h3 className="primary-font-color">Edit Barang</h3>
                <FormProvider {...methods}>
                  <Form encType='multipart/form-data' onSubmit = {methods.handleSubmit(handleItemUpdate, handleError)}>
                    <div className="image-listing-upload-wrapper">
                      {/* uncontrolled by React Hook Form. */}
                      <CustomUpdateImageUploader 
                        inputName="itemPictures" 
                        localPaths={Object.keys(item).length === 0 ? [] : item.ItemPictureLocalPaths}
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
                        selectName="deliveryOptions"
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

export default EditItem