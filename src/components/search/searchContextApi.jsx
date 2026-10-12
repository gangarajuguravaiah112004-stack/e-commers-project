import { Children, createContext, useState } from "react";


export const searchContext=createContext()
const searchContextApi=({Children})=>{
    const [allproducts,setallproducts]=useState([])
    const [products,setproducts]=useState([])
}