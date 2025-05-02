import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../assets/css/bootstrap.min.css";
import "../assets/css/style.css";
import "../assets/css/fontawesome.min.css";
import "../assets/css/solid.css";
import "../assets/css/brands.css";
import logo from "../assets/img/logo_alkem_50.png";
import fb from "../assets/img/fb.png";
import insta from "../assets/img/insta.png";
import ld from "../assets/img/ld.png";
import twitter from "../assets/img/twitter_d.png";
import youtube from "../assets/img/youtube.png";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { API_REQUEST } from "../apiurl";
import Spinner from "./common/Spinner";
import { Table } from "react-bootstrap";

function GenericBrandDetails() {
  const [brands, setbrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const brandData = await axios.post(
          API_REQUEST + "view_card/getGenericBrand"
        );
        //const brandData =  await axios.post("https://localhost:5001/api/view_card/getGenericBrand");
        setbrands(brandData.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  if (loading) {
    return <Spinner></Spinner>;
  }

  const tdStyle = {
    padding: "5px",
  };
  const thStyle = {
    padding: "5px",
  };

  return (
    <div>
      {brands.length > 0 ? (
        <div className="bg-light1">
          <div className="container">
            <div className="row p-4">
              <div className="col-5 text-left">
                <a className="navbar-brand" href="#">
                  <img src={logo} className="img-fluid" alt="" />
                </a>
              </div>
              <div className="col-7 text-left">
                <h1>Generic Products</h1>
              </div>
            </div>

            <span className="brand-title"></span>
            <div className="row">
              <Table className="table table-bordered">
                <thead
                  className="thead-light"
                  style={{
                    backgroundColor: "#08338f",
                    color: "white",
                    position: "sticky",
                    zIndex: 0,
                    top: 0,
                  }}
                >
                  <tr>
                    <th style={tdStyle}> Composition </th>
                    <th style={tdStyle}> Product Name </th>
                    <th style={tdStyle}> Div </th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((item, index) => (
                    <tr>
                      <td style={tdStyle}> {item.composition} </td>
                      <td style={tdStyle}> {item.product_name} </td>
                      <td style={tdStyle}> {item.div_name} </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default GenericBrandDetails;
