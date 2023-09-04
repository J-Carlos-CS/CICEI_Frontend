import React from 'react'
import Production from '../Production'
export default function Products({products=null}) {
  return (
    <Production products={products}/>
  )
}
