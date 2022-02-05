import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './home.scss';
import Select from 'react-select'
import { rupiah } from "../utils/Func";


const Categories = (props) => {
    const [categories, setCategories] = useState([]);
    const [childrenCategories, setChildrenCategories] = useState([]);

    const [activeChild, setActiveChild] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState('');
    const [selectedChild, setSelectedChild] = useState('');
    const [listSkuCategory, setListSkuCategory] = useState([]);

    const [productList, setProductList] = useState([]);

    const [category_id, setCategory_id] = useState('');

    const [currentPage] = useState(1);


    const [loadingProduct, setLoadingProduct] = useState(false);
    const [loadingLoadMore, setLoadingLoadMore] = useState(false);


    useEffect(() => {
        axios.get('https://staging-cuan.awalmula.co/rest/default/V1/categories')
            .then(response => {
                let data = response.data.children_data
                // console.log('data', data)
                let arr = []
                data.forEach(el => {
                    arr.push({
                        ...el,
                        value: el.id,
                        label: el.name,
                        isDisabled: el.is_active
                    });
                });
                setCategories(arr)
            })
        return () => {
            setCategories([])
        }
    }, []);

    useEffect(() => {
        if (selectedChild) {
            axios.get(`https://staging-cuan.awalmula.co/rest/default/V1/categories/${selectedChild.id}/products`)
                .then(response => {
                    let data = response.data
                    // console.log('data', data)
                    setListSkuCategory(data)
                })
        }
        return () => {
            setListSkuCategory([])
        }
    }, [selectedChild]);

    const fetchingProduct = (currentPage) => {
        // console.log('page', currentPage)
        if (currentPage === 1) {
            setLoadingProduct(true)
        } else {
            setLoadingLoadMore(true)
        }

        if (selectedCategories) {
            let pageSize = 10
            let url = `
            https://staging-cuan.awalmula.co/rest/default/V1/products?
            searchCriteria[pageSize]=${pageSize}&
            searchCriteria[currentPage]=${currentPage}&
            searchCriteria[sort_orders][0][field]=position&
            searchCriteria[sort_orders][0][direction]=desc&
            searchCriteria[filter_groups][0][filters][0][field]=category_id&
            searchCriteria[filter_groups][0][filters][0][value]=${category_id}&
            searchCriteria[filter_groups][0][filters][0][condition_type]=eq&
            searchCriteria[filter_groups][1][filters][0][field]=visibility&
            searchCriteria[filter_groups][1][filters][0][value]=4&
            searchCriteria[filter_groups][1][filters][0][condition_type]=eq&
            searchCriteria[filter_groups][2][filters][0][field]=status&
            searchCriteria[filter_groups][2][filters][0][value]=1&
            searchCriteria[filter_groups][2][filters][0][condition_type]=eq
            `
            axios.get(url)
                .then(response => {
                    let data = response.data.items
                    // console.log('data', data)
                    let arr = []
                    data.forEach(el => {
                        arr.push(el)
                    })
                    // console.log('arr', arr)
                    setProductList((prevState) => {
                        return [...prevState, ...arr]
                    })
                    if (currentPage === 1) {
                        setLoadingProduct(false)
                    } else {
                        setLoadingLoadMore(false)
                    }
                })
        } else if (selectedChild) {
            let pageSize = listSkuCategory.length >= 10 ? 10 : listSkuCategory.length
            let url = `
            https://staging-cuan.awalmula.co/rest/default/V1/products?
            searchCriteria[pageSize]=${pageSize}&
            searchCriteria[currentPage]=1&
            searchCriteria[sort_orders][0][field]=position&
            searchCriteria[sort_orders][0][direction]=desc&
            searchCriteria[filter_groups][0][filters][0][field]=category_id&
            searchCriteria[filter_groups][0][filters][0][value]=${category_id}&
            searchCriteria[filter_groups][0][filters][0][condition_type]=eq&
            searchCriteria[filter_groups][1][filters][0][field]=visibility&
            searchCriteria[filter_groups][1][filters][0][value]=4&
            searchCriteria[filter_groups][1][filters][0][condition_type]=eq&
            searchCriteria[filter_groups][2][filters][0][field]=status&
            searchCriteria[filter_groups][2][filters][0][value]=1&
            searchCriteria[filter_groups][2][filters][0][condition_type]=eq
            `
            axios.get(url)
                .then(response => {
                    let data = response.data.items
                    // console.log('data', data)
                    let arr = []
                    data.forEach(el => {
                        arr.push(el)
                    })
                    // console.log('arr', arr)
                    setProductList((prevState) => {
                        return [...prevState, ...arr]
                    })
                    if (currentPage === 1) {
                        setLoadingProduct(false)
                    } else {
                        setLoadingLoadMore(false)
                    }
                })
        } else {
            let pageSize = 10
            let url = `
            https://staging-cuan.awalmula.co/rest/default/V1/products?
            searchCriteria[pageSize]=${pageSize}&
            searchCriteria[currentPage]=${currentPage}
            `
            axios.get(url)
                .then(response => {
                    let data = response.data.items
                    // console.log('data', data)
                    let arr = []
                    data.forEach(el => {
                        arr.push(el)
                    })
                    // console.log('arr', arr)
                    setProductList((prevState) => {
                        return [...prevState, ...arr]
                    })
                    if (currentPage === 1) {
                        setLoadingProduct(false)
                    } else {
                        setLoadingLoadMore(false)
                    }
                })
        }
    }

    useEffect(() => {
        fetchingProduct(currentPage);
        return () => {
            setProductList([]);
        }
    }, [category_id]);  // eslint-disable-line react-hooks/exhaustive-deps


    const formatOptionLabel = ({ value, label, children_data }) => {
        return (
            <div style={{
                display: "flex",
                flexDirection: 'row',
                width: '100%',
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: 'flex-start',
                    width: "50%"
                }}
                >{label}</div>
                {
                    children_data.length > 0 && <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "50%",
                        opacity: 0.6
                    }}>
                        ({children_data.length})
                    </div>
                }
            </div>
        )
    };

    const handleChange = async (selected) => {
        // console.log('selected', selected)
        await setListSkuCategory([]);
        // await setProductList([]);
        await setActiveChild(null)
        await setSelectedCategories(selected)
        await setCategory_id(selected.id)
        await setChildrenCategories(selected.children_data)
    }

    const handleChild = async (data) => {
        // console.log('data', data);
        // await setProductList([]);
        await setActiveChild(data.id)
        await setCategory_id(data.id)
        await setSelectedChild(data)
    }

    const handleLoadMore = async (page) => {
        fetchingProduct(page);
    }

    // console.log('selectedChild', selectedChild)
    return (
        <>
            <div className="fixed">
                <div className="categories-container">
                    <Link to='/' className="title"><h3>Awal Mula Test</h3></Link>
                    <Select
                        value={selectedCategories}
                        onChange={handleChange}
                        options={categories}
                        formatOptionLabel={formatOptionLabel}
                        isOptionDisabled={(option) => option.isdisabled}
                        placeholder="Select a category"
                    />
                </div>
                <div className="categories-children-container">
                    <div className="categories-children">
                        {
                            childrenCategories.map((child, index) => {
                                return (
                                    <div key={index} id={child.id} className={`item ${activeChild === child.id ? 'active' : ''}`} onClick={() => handleChild(child)}>
                                        {child.name}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* <div className="categories-sku-container">
                currentPage: {currentPage}
            </div> */}

            {
                productList?.length > 0 && !loadingProduct ? (
                    <>
                        <div className="product-container">
                            {
                                productList.map((product, index) => {
                                    let pathUrlImage = 'https://cuan.awalmula.co/pub/media/catalog/product';
                                    let dataImage = product.media_gallery_entries?.length > 0 ? product.media_gallery_entries[0].file : '';
                                    let ext = product.extension_attributes;
                                    let brand = ext ? JSON.parse(ext.brand[0]) : '';
                                    let warehouse_data = ext ? JSON.parse(ext.warehouse_data[0]) : '';
                                    // console.log('product', product)
                                    return (
                                        <Link to={{
                                            pathname: `/product/${product.id}`,
                                            state: { product }
                                        }}
                                            key={index} className="product-list">
                                            <div className="product-item">
                                                <div className="item-image">
                                                    <img src={pathUrlImage + dataImage} alt={product.name} />
                                                </div>
                                                <div className="item-desc">
                                                    <div className="brand">
                                                        {brand.brand_name}
                                                    </div>
                                                    <div className="name">
                                                        {product.name}
                                                    </div>
                                                    <div className="from">
                                                        {warehouse_data.name}
                                                    </div>
                                                    <div className="price">
                                                        {product.price ? rupiah(product.price) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })
                            }
                            {
                                loadingLoadMore ? (
                                    <div className="loading-product">Loading...</div>
                                ) : (
                                    <div className="load-more" onClick={() => handleLoadMore(currentPage + 1)}>
                                        Load more..
                                    </div>
                                )
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <div className="product-container">
                            <div className="loading-product">Loading...</div>
                        </div>
                    </>
                )
            }

        </>
    )
}
export default Categories;