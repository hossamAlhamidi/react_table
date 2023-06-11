import React, { HTMLAttributes, HTMLProps } from 'react';
import ReactDOM from 'react-dom/client';

import {
  createColumnHelper,
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  getSortedRowModel,
  SortingState,
  PaginationState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { makeData, Person } from './makeData';
import { Select } from './Select';
import { QueryClient, useQuery } from 'react-query';

import { fetchData } from './fetchData';

// const queryClient = new QueryClient()

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
//   visits: number
//   status: string
//   progress: number
// }

// const defaultData: Person[] = [
//   {
//     firstName: 'tanner',
//     lastName: 'linsley',
//     age: 24,
//     visits: 100,
//     status: 'In Relationship',
//     progress: 50,
//   },
//   {
//     firstName: 'tandy',
//     lastName: 'miller',
//     age: 40,
//     visits: 40,
//     status: 'Single',
//     progress: 80,
//   },
//   {
//     firstName: 'joe',
//     lastName: 'dirte',
//     age: 45,
//     visits: 20,
//     status: 'Complicated',
//     progress: 10,
//   },
// ]

const columnHelper = createColumnHelper<Person>();

const columns = [
  {
    id: 'select',
    header: ({ table }: any) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),

    cell: ({ row }: any) => (
      <div className='px-1'>
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            // indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
            row: row.original,
          }}
        />
        {/* <input type='checkbox' checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()}   /> */}
      </div>
    ),
  },
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    header: () => <span>First Name</span>,
    // footer: info => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    // footer: info => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    // footer: info => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    // footer: info => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    // footer: info => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    // footer: info => info.column.id,
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => (
      <button
        className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
        onClick={() => console.log(props.row.original.firstName)}
      >
        Edit
      </button>
    ),
  }),
];
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

function TableCustom() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState('');

  // const defaultColumn: Partial<ColumnDef<Person>> = {
  //   cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
  //     const initialValue = getValue();
  //     // We need to keep and update the state of the cell normally
  //     const [value, setValue] = React.useState(initialValue);

  //     // When the input is blurred, we'll call our table meta's updateData function
  //     const onBlur = () => {
  //       table.options.meta?.updateData(index, id, value);
  //     };

  //     // If the initialValue is changed external, sync it up with our state
  //     React.useEffect(() => {
  //       setValue(initialValue);
  //     }, [initialValue]);

  //     return (
  //       <input
  //         value={value as string}
  //         onChange={(e) => setValue(e.target.value)}
  //         onBlur={onBlur}
  //       />
  //     );
  //   },
  // };

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };

  const dataQuery = useQuery(
    ['data', fetchDataOptions],
    () => fetchData(fetchDataOptions),
    { keepPreviousData: true }
  );

  const defaultData = React.useMemo(() => [], []);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  //   const columns = React.useMemo<ColumnDef<Person>[]>(
  //     () => [
  //       {
  //         header: 'Name',
  //         footer: props => props.column.id,
  //         columns: [
  //           {
  //             accessorKey: 'firstName',
  //             footer: props => props.column.id,
  //           },
  //           {
  //             accessorFn: row => row.lastName,
  //             id: 'lastName',
  //             header: () => <span>Last Name</span>,
  //             footer: props => props.column.id,
  //           },
  //         ],
  //       },
  //       {
  //         header: 'Info',
  //         footer: props => props.column.id,
  //         columns: [
  //           {
  //             accessorKey: 'age',
  //             header: () => 'Age',
  //             footer: props => props.column.id,
  //           },
  //           {
  //             header: 'More Info',
  //             columns: [
  //               {
  //                 accessorKey: 'visits',
  //                 header: () => <span>Visits</span>,
  //                 footer: props => props.column.id,
  //               },
  //               {
  //                 accessorKey: 'status',
  //                 header: 'Status',
  //                 footer: props => props.column.id,
  //               },
  //               {
  //                 accessorKey: 'progress',
  //                 header: 'Profile Progress',
  //                 footer: props => props.column.id,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //     []
  //   )

  // const [data, setData] = React.useState(() => makeData(1000));
  const rerender = React.useReducer(() => ({}), {})[1];

  const tableHooks = (hooks: any) => {};

  const table = useReactTable({
    // data,
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    // defaultColumn,
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
      rowSelection,
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='p-2 max-w-6xl mx-auto  relative overflow-x-auto '>
      {/* <div className='my-5'>
        <input
          placeholder={`Search...`}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='max-w-sm w-11/12 border px-3 py-1'
        />
      </div> */}
      <div className='  my-6 md:w-1/2 mx-auto'>
        <div>
          <input
            type='text'
            placeholder={`Search...`}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            id='search'
            className=' border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          />
        </div>
      </div>
      <div className='inline-block border border-white shadow rounded w-full flex p-5 my-10 justify-around flex-wrap'>
        <div className='px-1 '>
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map((column) => {
          return (
            <div key={column.id} className='px-1'>
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{' '}
                {column.id}
              </label>
            </div>
          );
        })}
      </div>
      <div className='overflow-x-auto'>
        <table
          className='min-w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400   '
          //   style={{width:'70%',margin:'auto',border:'1px solid black',padding:'20px 0px'}}
        >
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope='col' className='px-6 py-3'>
                    {header.isPlaceholder ? null : (
                      <div>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}

                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : // <div >
                        //   {/* {
                        //   // JSON.stringify(header.column.columnDef.header)
                        //   <p>
                        //     <>
                        //     {console.log(flexRender(
                        //   header.column.columnDef.header,
                        //   header.getContext()
                        // ))}
                        //     </>
                        //   </p>
                        //   } */}
                        //   <input
                        //     placeholder={`Search ${header.column.id}...`}
                        //     value={
                        //       (header.column
                        //         ?.getFilterValue() as string) ?? ''
                        //     }
                        //     onChange={(event) =>
                        //       header.column
                        //         ?.setFilterValue(event.target.value)
                        //     }
                        //     className='max-w-sm w-11/12 border px-3 py-1'
                        //   />

                        // </div>
                        null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`bg-white border-b  dark:border-gray-700 ${
                  index == 0 ? '' : ''
                } ${
                  index % 2 === 0
                    ? 'bg-gray-50 dark:bg-gray-900 dark:border-gray-700'
                    : 'dark:bg-gray-800'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='px-6 py-4'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
        </table>
      </div>
      {/* <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button> */}
      <div className='flex items-center gap-2 my-8 justify-center flex-wrap'>
        <button
          className='border rounded p-1'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className='border rounded p-1'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className='border rounded p-1'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className='border rounded p-1'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className='flex items-center gap-1'>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className='flex items-center gap-1'>
          | Go to page:
          <input
            type='number'
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className=' text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-16 mx-3 bg-gray-800'
            style={{height:'36px'}}
          />
        </span>
        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
        <Select
          value={table.getState().pagination.pageSize}
          table={table}
        />
      </div>
      <div>
        {table.getRowModel().rows.length}
        <span className='mx-2'>Rows</span>
        {Object.keys(rowSelection).length} of{' '}
      </div>
      <div></div>
      {dataQuery.isFetching ? 'Loading...' : null}
      {/* {JSON.stringify(rowSelection)} */}
    </div>
  );
}

export default TableCustom;

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className='flex space-x-2'>
      <input
        type='number'
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className='w-12 border shadow rounded mt-2 ps-2 py-1'
        style={{ backgroundColor: '#101827' }}
      />
      <input
        type='number'
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className='w-12 border shadow rounded mt-2 ps-2 py-1'
        style={{ backgroundColor: '#101827' }}
      />
    </div>
  ) : (
    <input
      type='text'
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className='w-24 border shadow rounded mt-2 ps-2 py-1'
      style={{ backgroundColor: '#101827' }}
    />
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  row,
  ...rest
}: { indeterminate?: boolean; row?: any } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <div className='flex items-center mb-4'>
      <input
        type='checkbox'
        ref={ref}
        id='default-checkbox'
        className={
          className +
          ' cursor-pointer w-4 h-4 text-blue-600   rounded  focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600'
        }
        {...rest}
      />
      {/* {JSON.stringify(rest.checked && row ||'')} */}
    </div>
  );
}
