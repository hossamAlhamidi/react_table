import React from 'react'
// import {useAsyncDebounce} from '@tanstack/react-table'
const GlobalFilter = ({PreGlobalFilteredRows,globalFilter,setGlobalFilter}:any) => {
    const count = PreGlobalFilteredRows.length
    const [value,setValue] = React.useState(globalFilter)
    const onChange = (e:any) => {
        setValue(e.target.value||'')
        setGlobalFilter(e.target.value||undefined)
    }
  return (
    <div>
      <input
      value={value}
        onChange={onChange}
        placeholder={`Search ${count} records...`}
      />
    </div>
  )
}

export default GlobalFilter
