import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { useFormContext, Controller, useWatch } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message';
import ImgCrop from 'antd-img-crop';
import Form from 'react-bootstrap/Form'
import { v4 as uuidv4 } from 'uuid'
import Skeleton from '@mui/material/Skeleton';


// const [fileList, setFileList] = useState([]);

// const beforeUpload = (file) => {
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = () => {
//     setFileList((prev) => [...prev, { url: reader.result }]);
//   };
//   then upload `file` from the argument manually
//      return false;
//   };

const CustomUpdateImageUploader = (props) => {
  //    console.log('image uploader component called')
  // console.log('Uploader Called')
  // console.log(props)
  const [fileList, setFileList] = useState([]);
  //const URL = 'http://localhost:5000/api/test-request/image-upload';
  //    console.log('item picture state in child')
  //    console.log(fileList)
  //    useEffect(() => {
  //     setItemPicturesToParent(fileList)   
  //    }, [fileList])
    //console.log(props)
    const { 
      register,
      control,
      handleSubmit, 
      formState: { errors }, 
      setValue,
      getValues,
      reset,
    } 
    = useFormContext();

    //useWatch({name: props.inputName})

  const readFile = async (file) =>{
    console.log('read file called')
    return new Promise((resolve, reject) =>{
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = reject
    })
  }

  const beforeUpload = async (file, field) => {
    console.log('beforeupload called')
    const readerResult = await readFile(file)
    setFileList((prev) => [...prev, { uid:'update-base64-'+uuidv4(), url: readerResult, name: file.name, type: file.type }]);
    console.log('after reading file')
    //
    return false;
  }
  
  const onRemove = (file) =>{
    console.log('onRemove called')
    const index = fileList.indexOf(file)
    //console.log(file)
    setFileList(fileList.filter((_, i) => i !== index))
  }

  const onPreview = async file => {
    let src = file.url;
    console.log('onpreview called')
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  //ONCHANGE TEST
  const handleOnChange = (res, field) => {
    console.log('onchange fired')
    field.onChange(res.fileList)
  }

  useEffect(() => {
    console.log('useEffect called')
    if(props.existingImgs.length !== 0){
      setFileList(props.existingImgs)
      setValue(props.inputName, props.existingImgs )
    }
  },[props.existingImgs])

  if(Object.keys(props).length === 0 || props.existingImgs.length === 0){
    //console.log(props.existingImgs)
    return <Skeleton variant="rectangular" width={1366} height={80} />
  }
  else{
    // console.log(props.existingImgs)
    // console.log('GETVALUES INSIDE UPLOADER COMPONENT')
    // console.log(getValues())
    // console.log('FILELIST INSIDE UPLOADER COMPONENT')
    // console.log(fileList)
    return(
      <Controller 
          control={control}
          name={props.inputName}
          defaultValue={props.existingImgs}
          render={({
              field,
              formState: { errors },
          }) => (
              <>
              <Form.Label>Foto Barang</Form.Label>
                <ImgCrop 
                  rotate 
                  zoom grid={true} 
                  modalTitle="Atur foto"
                  modalCancel="Batal"
                >
                  <Upload
                    progress
                    listType="picture-card"
                    defaultFileList={props.existingImgs}
                    fileList={fileList}
                    onPreview={onPreview}
                    beforeUpload = {(file) => beforeUpload(file, field)}
                    // onChange={(e) => handleOnChange(e, field)}
                    // onChange={(e) => field.onChange(e.fileList)}
                    onChange={(res) => handleOnChange(res, field)}
                    onRemove={(file) => onRemove(file)}
                    name={field.name}
                  >
                    {fileList.length < 5 && '+ Unggah Foto'}
                  </Upload>
                </ImgCrop>
                <ErrorMessage 
                  errors={errors} 
                  name={props.inputName} 
                  render={({ message }) => <p style={{fontSize:'0.9rem', color:'red'}}>{message}</p>}
                />
              </>
          )
      }
  
      rules = {{required: "Foto barang tidak boleh kosong!"}}
      />
    );
  }
};

export default CustomUpdateImageUploader;