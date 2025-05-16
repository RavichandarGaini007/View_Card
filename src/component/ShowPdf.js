import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import axios from "axios";
import { API_REQUEST } from '../apiurl';
import Spinner from "./common/Spinner";
import { useParams, Navigate } from "react-router-dom";

const baseUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
  ? import.meta.env.BASE_URL
  : '/view_card';

GlobalWorkerOptions.workerSrc = `${baseUrl}/pdf.worker.min.js`;

function Button() {
  return (<button
    style={{
      padding: '12px 28px',
      fontSize: '16px',
      backgroundColor: '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = '#4338ca';
      e.currentTarget.style.transform = 'scale(1.05)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = '#4f46e5';
      e.currentTarget.style.transform = 'scale(1)';
    }}
  >
    ⬇️ Download PDF
  </button>)
}

function ShowPdf() {
  const { invoiceno } = useParams(); 
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef();
  //const location = useLocation();
  const [loading, setLoading] = useState(true);

  //const searchParams = new URLSearchParams(location.search);
  //const encodedParam = searchParams.get('param1'); // get base64 encoded value

  // Decode base64
  // const decodedParam = encodedParam
  //   ? atob(encodedParam)
  //   : null;

      // Decode base64
  const decodedParam = invoiceno
  ? atob(invoiceno)
  : null;

  const paramValues = decodedParam?.split('$') || [];
  const InvoiceNo = paramValues.length > 0 ? paramValues[0] : '';
  const filename = InvoiceNo +".pdf";
  const base64ToUint8Array = (base64) => {
    const cleaned = base64.replace(/^data:application\/pdf;base64,/, '');
    const raw = atob(cleaned);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const fetchDetails = async () => {
          debugger;
          try {
            // POST request to fetch employee details  API_REQUEST + "view_card/getempdetails?empcode=" + "041406",
            const employeeResponse = await axios.get(
              API_REQUEST +
                "view_card/getinvoicepdf?invoiceno=" +
                encodeURIComponent(InvoiceNo)
            );
            if (employeeResponse.data.code == 1) {
              const pdfBase64 = employeeResponse.data.data; // <-- adjust this key based on actual response
              if (pdfBase64) {
                const byteArray = base64ToUint8Array(pdfBase64);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setLoading(false);
              } 
              else {
                setLoading(false);
                console.error('No PDF data found in response'+employeeResponse.data.message);
              }
            }
            else{
              setLoading(false);
              console.error('No PDF data found in response' + employeeResponse.data.message);
            } 
          } catch (err) {
            window.location.replace("https://www.alkemlabs.com/");
            setLoading(false);
          }
        };
        fetchDetails();
        

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      {pdfUrl ? (
        <div style={{ backgroundColor: 'currentColor', padding: '50px' }} ref={containerRef}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a href={pdfUrl} download={filename} style={{ textDecoration: 'none' }}>
              <Button />
            </a>
          </div>
  
          <br />
  
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => console.error('PDF load error:', err)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} style={{ marginBottom: '20px' }}>
                <Page
                  pageNumber={index + 1}
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
  
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a href={pdfUrl} download={filename} style={{ textDecoration: 'none' }}>
              <Button />
            </a>
          </div>
        </div>
      ) : (
        <div ref={containerRef}>
          {loading ? (
            <Spinner />
          ) : (
            <p>PDF loading failed</p>
          )}
        </div>
      )}
    </>
  );
  
  
}

export default ShowPdf;
