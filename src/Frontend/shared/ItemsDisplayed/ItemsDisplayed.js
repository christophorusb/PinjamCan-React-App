import {React, useState, useEffect} from 'react'
import Row from 'react-bootstrap/Row';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import ItemCard from '../../shared/ItemCard/ItemCard';
import {Modal as AntDModal} from 'antd';
import Button from 'react-bootstrap/Button'
import { v4 as uuidv4 } from 'uuid';
import NoItemsDisplayed from './NoItemsDisplayed';
import WishListEmpty from './WishListEmpty';
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'

const ItemsDisplayed = (props) => {
    //console.log(props)
    const handleDeleteItemFromWishList = (itemId) => {
        console.log('delete from wishlist')
        console.log(itemId)
        axios({
            method: 'DELETE',
            url: `http://localhost:5000/api/wishlist/${itemId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            if(res.data.statusText === 'ITEM_DELETED_FROM_WISHLIST'){
                AntDModal.success({
                    content: 'Barang sudah dihapus dari wishlist!',
                    onOk: () => {
                        window.location.reload()
                    }
                });
            }
        })
    }
    if(props.responseStatus === 'SUCCESS_NO_ITEM'){
        return(
            <Row sm="2" md='2' lg='4' xl='4' xxl='5' className="g-4 position-relative" >
                <NoItemsDisplayed />
            </Row>
        )
    }

    if(props.responseStatus === 'WISHLIST_EMPTY'){
        return(
            <WishListEmpty />
        )
    }
    return (
        <Row sm="2" md='2' lg='4' xl='4' xxl='5' className="g-4 pb-5" >
            {
                (props.itemsList.length === 0 ? Array.from(new Array(15)) :  props.itemsList)
                .map(item => (
                <div key={item ? item._id : uuidv4()}>
                    {
                        props.isWishList === true ? 
                        (
                            <div className="p-3 border" style={{backgroundColor: '#f5f5f5', borderRadius: '10px 10px 10px 10px'}}>
                                <Link to={`/home/item/${item._id}`}>
                                    <ItemCard 
                                        MainItemPictureLocalPath={item.MainItemPictureLocalPath} 
                                        ItemName={item.ItemName} 
                                        ItemPriceDailyMinimum={item.ItemPriceDailyMinimum}
                                        ItemRatings={item.ItemRatings}
                                        ItemId={item._id}
                                        isWishList={props.isWishList}
                                    />
                                </Link>
                                <div className="d-flex justify-content-center mt-4">
                                    <Button className="btn-sm  btn-danger" onClick={() => handleDeleteItemFromWishList(item._id)}>
                                        <FaTrash /> Hapus dari wishlist
                                    </Button>
                                </div>
                            </div>
                        )
                        :
                        (
                            <Link to={localStorage.getItem('token') ? `/home/item/${item._id}` : `/item/${item._id}`}>
                                <ItemCard 
                                    MainItemPictureLocalPath={item.MainItemPictureLocalPath} 
                                    ItemName={item.ItemName} 
                                    ItemPriceDailyMinimum={item.ItemPriceDailyMinimum}
                                    ItemRatings={item.ItemRatings}
                                />
                            </Link >
                        )
                    }
                </div>
                ))
            }
        </Row>
    )
}

export default ItemsDisplayed