import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { useFormContext, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message';
import ImgCrop from 'antd-img-crop';
import Form from 'react-bootstrap/Form'
import { v4 as uuidv4 } from 'uuid'


// const [fileList, setFileList] = useState([]);

// const beforeUpload = (file) => {
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = () => {
//     setFileList((prev) => [...prev, { url: reader.result }]);
//   };

//   // then upload `file` from the argument manually
//   return false;
// };

const CustomImageUploader = (props) => {
//   console.log('image uploader component called')
  const [fileList, setFileList] = useState([]);
  console.log(fileList)
  //const URL = 'http://localhost:5000/api/test-request/image-upload';
//   console.log('item picture state in child')
  //console.log(fileList)
//   useEffect(() => {
//     setItemPicturesToParent(fileList)   
//   }, [fileList])

  const { 
    register,
    control,
    handleSubmit, 
    formState: { errors }, 
     } 
    = useFormContext();

  const readFile = async (file) =>{
    console.log('read file called')
    console.log(file)
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
    // console.log(file)
    const readerResult = await readFile(file)
    //console.log(readerResult)
    setFileList((prev) => [...prev, { uid:'base64-'+uuidv4(), url: readerResult, name: file.name, type: file.type }]);
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

  return(
    <Controller 
        control={control}
        name={props.inputName}
        defaultValue={[]}
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
};

export default CustomImageUploader;