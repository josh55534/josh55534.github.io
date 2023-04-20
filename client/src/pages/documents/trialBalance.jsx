import { Page, Text, View, Document } from '@react-pdf/renderer';

import { useEffect, useState } from 'react';

import axios from "axios";

import { dStyles } from './document-styles/defaultStyles';
import { tableRow, tableHead, tableName, tableVal } from "./document-styles/tbStyles.js";

const token = localStorage.getItem("token");

function TD(props) {
  return (
    <View style={props.styling}>
      <Text style={dStyles.p}>{props.children}</Text>
    </View>
  )
};

function TrialBalance() {
  const [date, setDate] = useState("2023-4-21");
  const [rowID, setRowID] = useState([]);
  const [isLoading, setLoading] = useState(true)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect((req, res) => {
    if (rowID.length === 0) {
      axios
        .get(`http://localhost:5000/documents/trialBalance/${date}`, config)
        .then((res) => {
          const { data } = res;
          setRowID(data);
          setLoading(false)
        });
    }
  });

  return (
    <>
      {!isLoading && (
          <Document>
            <Page size="A4" style={dStyles.page}>
              <View style={dStyles.header}>
                <Text style={dStyles.h1}>Trial Balance Sheet</Text>
                <Text style={dStyles.h2}>As on {date}</Text>
              </View>
              <View style={dStyles.body}>
                <View style={dStyles.table}>
                  <View style={tableHead}>
                    <TD styling={tableName}>Account Name</TD>
                    <TD styling={tableVal}>Debit</TD>
                    <TD styling={tableVal}>Credit</TD>
                  </View>
                  {rowID.map((d, index) => (
                    <View style={(index === rowID.length - 1) ? tableHead : tableRow}>
                      <TD styling={tableName}>{d.name}</TD>
                      <TD styling={tableVal}>{d.credit}</TD>
                      <TD styling={tableVal}>{d.debit}</TD>
                    </View>
                  ))}
                </View>
              </View>
            </Page>
          </Document>
      )}
    </>
  )
}

export { TrialBalance }