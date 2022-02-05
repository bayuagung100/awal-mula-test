import { faArrowAltCircleLeft, faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import './productDetail.scss';
import { useSwipeable } from 'react-swipeable';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import parseHtml from 'html-react-parser';
import { rupiah } from "../utils/Func";


const ProductDetail = (props) => {
    // console.log(props);
    let back = useHistory();
    const pathUrlImage = 'https://cuan.awalmula.co/pub/media/catalog/product';
    const product = props.location.state?.product;
    const slideshowArr = product.media_gallery_entries;
    const ext = product.extension_attributes;
    const stock = ext ? JSON.parse(ext.simple_product_stock_status[0]).stock_status : '';
    const brand = ext ? JSON.parse(ext.brand[0]) : '';
    const cus = product.custom_attributes;
    const shortDesc = cus ? cus.find((obj) => obj.attribute_code === 'short_description') : '';
    const deskripsi = cus ? cus.find((obj) => obj.attribute_code === 'description') : '';
    const infoGIzi = cus ? cus.find((obj) => obj.attribute_code === 'informasi_gizi') : '';

    console.log("shortDesc", shortDesc);

    const [indexSlide, setIndexSlide] = useState(0);
    const timeoutRef = useRef(null);
    const [paused, setPaused] = useState(false);

    const delay = 5000;
    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            if (!paused) {
                setIndexSlide((prevIndex) =>
                    prevIndex === slideshowArr.length - 1 ? 0 : prevIndex + 1
                )
            }
        }, delay);
        return () => {
            resetTimeout();
        };
    }, [indexSlide, paused, slideshowArr.length]);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            setIndexSlide((prevIndex) =>
                prevIndex === slideshowArr.length - 1 ? 0 : prevIndex + 1
            )
        },
        onSwipedRight: () => {
            setIndexSlide((prevIndex) =>
                prevIndex === 0 ? slideshowArr.length - 1 : prevIndex - 1
            )
        },
    });


    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <>
            <div className="fixed-detail">
                <div className="header-container">
                    <div className='back' onClick={() => back.goBack()}>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Kembali
                    </div>
                </div>
            </div>
            <div className="product-detail-container">
                <div
                    {...handlers}
                    className="slideshow"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div
                        className="slideshowSlider"
                        style={{ transform: `translateX(-${indexSlide * 100}%)` }}
                    >
                        {
                            slideshowArr.map((val, _index) => {
                                // let dataImage = file?.length > 0 ? slideshowArr.media_gallery_entries[0].file : '';
                                return (
                                    <div key={_index} className='slide'>
                                        <img src={pathUrlImage + val.file} alt={product.name} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="slideshowDots">
                        <div className="prev"
                            onClick={() => {
                                setIndexSlide((prevIndex) =>
                                    prevIndex === 0 ? slideshowArr.length - 1 : prevIndex - 1
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                        </div>
                        {
                            slideshowArr.map((itm, ind) => {
                                return (
                                    <div key={ind}
                                        className={`slideshowDot ${indexSlide === ind ? "active" : ""}`}
                                        onClick={() => {
                                            setIndexSlide(ind);
                                        }}
                                    >
                                        <img src={pathUrlImage + itm.file} alt={product.name} />
                                    </div>
                                )
                            })
                        }
                        <div className="next"
                            onClick={() => {
                                setIndexSlide((prevIndex) =>
                                    prevIndex === slideshowArr.length - 1 ? 0 : prevIndex + 1
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowAltCircleRight} />
                        </div>
                    </div>
                </div>
                <div className="product-detail">
                    <div className="category">
                        {brand.brand_name}
                    </div>
                    <div className="title">
                        {product.name}
                    </div>
                    <div className="price-container">
                        <div className="price">
                            {product.price ? rupiah(product.price) : ''}
                        </div>
                        <div className={`stock ${stock ? "available" : "unavailable"}`}>
                            {stock ? "Tersedia" : "Habis"}
                        </div>
                    </div>
                </div>
                {/* <div className="">
                    {shortDesc ? parseHtml(shortDesc.value) : ''}
                </div> */}
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} >
                                <Tab label="Deskripsi" value="1" />
                                <Tab label="Informasi Gizi" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {deskripsi ? parseHtml(deskripsi.value) : ''}
                        </TabPanel>
                        <TabPanel value="2">
                            {infoGIzi ? parseHtml(infoGIzi.value) : ''}
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </>
    )
}

export default ProductDetail;