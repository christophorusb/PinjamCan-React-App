import axios from 'axios'
import { React, useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'antd/dist/antd.css';
import moment from 'moment';
import { DatePicker, Modal, Space } from 'antd';
const { RangePicker } = DatePicker;

function AvailabilityModal(props) {
    // const dateBookList = [
    //   moment("2022-06-07").format("YYYY-MM-DD"),
    //   moment("2022-06-08").format("YYYY-MM-DD"),
    //   moment("2022-06-09").format("YYYY-MM-DD"),
    //   moment("2022-06-10").format("YYYY-MM-DD"),
    //   moment("2022-07-11").format("YYYY-MM-DD"),
    // ];
    const borrowDates = useRef([])

    if(props.ItemBorrowDates){
      props.ItemBorrowDates.forEach(itemBorrowDate => {
        const momentConverted = moment(itemBorrowDate).format('YYYY-MM-DD')
        console.log(momentConverted)
        borrowDates.current.push(momentConverted)
      })
    }
    
  
    let navigate = useNavigate();
    const [dateStrings, setDateStrings] = useState([]);
    const [momentDateObj, setMomentDateObj] = useState([])
    const [isDateInputFailed, setIsDateInputFailed] = useState(false);

    const checkWithMinimumRentDuration = (momentDateObj) => {
      const startDate = momentDateObj[0].toDate()
      const endDate = momentDateObj[1].toDate()
      const diff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))

      console.log(`dateDiff: ${diff}`)

      if(diff < props.ItemMinimumRentDuration){
        return false
      }
      return true
    }

    const disabledDate = (current) => {
      // Can not select days before today and today
      if (borrowDates.current.includes(current.format("YYYY-MM-DD"))) {
        return true;
      }
      return current && current < moment().endOf('day');
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if(dateStrings.length === 0 || dateStrings[0] === ''){
        Modal.warning({
          title: 'Tanggal peminjaman tidak boleh ada yang kosong!',
          zIndex: 9999,
          onOk: () => {
            setIsDateInputFailed(true)
          }
        });
      }
      else{
        const isGreaterThanMinimumRentDuration = checkWithMinimumRentDuration(momentDateObj)
        if(isGreaterThanMinimumRentDuration){ 
          let auth_token = localStorage.getItem('token')
          let modifiedItemBorrowDate = [...momentDateObj, momentDateObj[1].clone().add(1, 'days')]
          axios({
            method: 'post',
            url: `http://localhost:5000/api/cart/${props.ItemId}`,
            headers: {
              'Authorization': auth_token,
              'Content-Type': 'application/json',
            },
            data: {
              ItemBorrowDate: modifiedItemBorrowDate,
            }
          }).then(res => {
            if(res.status === 200){
              if(res.data.statusText === 'POSTED_ITEM_TO_CART'){
                Modal.success({
                  title: 'Berhasil menambahkan ke keranjang!',
                  zIndex: 9999,
                  onOk: () => {
                    navigate('/cart') 
                  }
                })
              }
            }
          }).catch(err => {
            console.log(err.response.status)
            console.log(err.response.data)
            if(err.response.status === 401){
              //unauthorized, go back to login
              navigate('/login')
              //document.location.href = '/login'
            }
          })
        }
        else{
          Modal.warning({
            title: 'Durasi peminjaman kurang dari minimum!',
            zIndex: 9999,
            onOk: () => {
              setIsDateInputFailed(true)
            }
          });
        }
      }
    }
  
    return (
      <div>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center p-4">
            <RangePicker 
              placement='topLeft'
              disabledDate={disabledDate} 
              placeholder={['mulai dari', 'sampai']} 
              onChange = {(dates, dateStrings) => {
                setDateStrings(dateStrings)
                setMomentDateObj(dates)
              }}
            />
          </div>
          
          <Button type="submit" style={{width: '100%'}} className="primary-button">
            Pinjam Barang
          </Button>
        </Form>
          
      </div>
    );
  }
  
  export default AvailabilityModal;