import React, { useState, useEffect } from 'react';
import './App.css';
import ReactTable from 'react-table';
import axios from 'axios';
import 'react-table/react-table.css';
import 'antd/dist/antd.css';
import { Button, Typography } from 'antd';

const { Title } = Typography;

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = () => {
    setIsLoading(true);
    axios.get('https://touchebackend.herokuapp.com/ecomm_inventory/api/panel')
      .then((response) => {
        response.data.success ? setData(response.data.content) : setData([]);
      }).then(() => {
        setIsLoading(false);
      });
  };

  const updateDatabase = () => {
    setIsLoading(true);
    axios.post('https://touchebackend.herokuapp.com/ecomm_inventory/api/update_id_ean_database/')
      .then((response) => {
        response.data.success ? alert('Database updated.') : alert('Error: Couldnt update'
                                                                   + ' database');
      })
      .then(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const getDate = dateobject => dateobject.toLocaleDateString();
  const getTime = dateobject => dateobject.toLocaleTimeString();
  const columns = [
    {
      Header: 'Ürün Bilgileri',
      columns: [
        {
          Header: 'EAN',
          accessor: 'ean',
        }, {
          Header: 'SKU',
          accessor: 'shopifysku',
        }, {
          Header: 'Renk',
          accessor: 'shopifyrenk',
        }, {
          Header: 'Beden',
          accessor: 'shopifybeden',
        }],
    },

    {
      Header: 'Stok Farkı',
      columns: [
        {
          Header: 'Stok (Shopify)',
          accessor: 'available',
        },
        {
          Header: 'Stok (Nebim)',
          accessor: 'nebimstok',
        }],
    }, {
      Header: 'Stok Değişikliği',
      columns: [
        {
          id: 'sondegisikliktarihi',
          Header: 'Shopify Son Stok Değişikliği Günü',
          accessor: d => getDate(new Date(d.updated_at)),
        },
        {
          id: 'sondegisikliksaati',
          Header: 'Shopify Son Stok Değişikliği Saati',
          accessor: d => getTime(new Date(d.updated_at)),
        }],
    }];
  const pageSizeOptions = [5, 10, 15, 20, 25, 50, 100];
  return (
    <div>
      <div className="header">
        <Title style={{ marginTop: 15 }}>Shopify-Nebim Stok Entegrasyonu</Title>
      </div>
      <div className="header" style={{ marginBottom: 25 }}>
        <Button
          onClick={() => getData()}
          loading={isLoading}
          style={{ marginRight: 30, marginLeft: 30 }}
          type="default"
          size="large"
        >
Veriyi Yenile
        </Button>
        <Button
          onClick={() => updateDatabase()}
          style={{ marginRight: 30, marginLeft: 30 }}
          type="default"
          size="large"
        >
Veritabanını
          Güncelle
        </Button>
        <Button
          style={{ marginRight: 30, marginLeft: 30 }}
          type="danger"
          size="large"
        >
Stoğu
          Aktar
        </Button>
      </div>
      <ReactTable
        loading={isLoading}
        className="-striped -highlight"
        data={data}
        columns={columns}
        filterable
        pageSizeOptions={pageSizeOptions}
        defaultPageSize={15}
      />
    </div>
  );
}

export default App;
