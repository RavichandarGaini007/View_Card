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

const Profilebk = () => {
  const { employeeCode } = useParams(); // Get employee code from URL
  // const [employeeCode, setData] = useState("008275");
  const [employee, setEmployee] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [lastName, setlastName] = useState("");
  // Fetch both employee and product details using Axios
  useEffect(() => {
    const fetchDetails = async () => {
      debugger;
      try {
        // POST request to fetch employee details  API_REQUEST + "view_card/getempdetails?empcode=" + "041406",
        const employeeResponse = await axios.post(
          API_REQUEST +
            "view_card/getempdetails?empcode=" +
            encodeURIComponent(employeeCode)
          // API_REQUEST + "view_card/getempdetails?empcode=" + employeeCode
        );
        if (employeeResponse.data.code == 1) {
          setEmployee(employeeResponse.data.data);

          // GET request to fetch product details
          const brandResponse = await axios.post(
            API_REQUEST +
              "view_card/getbranddetails?empcode=" +
              encodeURIComponent(employeeCode)
            // API_REQUEST + "view_card/getbranddetails?empcode=" + employeeCode
          );
          setBrands(brandResponse.data.data);
        } else {
          window.location.replace("https://www.alkemlabs.com/");
          setLoading(false);
        }
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        window.location.replace("https://www.alkemlabs.com/");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [employeeCode]);

  if (redirect) return <Navigate to={redirect} />;
  if (loading) {
    return <Spinner></Spinner>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  // N:${employee[0].empname}
  // PHOTO;ENCODING=b;TYPE=JPEG:${employee[0].userprofile.split(",")[1]}
  // N:${lastName || ""};${employee[0].empname || ""};;;
  const downloadVCard = () => {
    debugger;
    const vCardContent = `
BEGIN:VCARD
VERSION:3.0
FN:${employee[0].empname}
N:${lastName || ""};${employee[0].empname || ""};
EMAIL:${employee[0].emailid}
TEL;TYPE=CELL:${employee[0].mobileno}
ORG:Alkem
TITLE:${employee[0].designation}
END:VCARD
    `.trim();

    const blob = new Blob([vCardContent], { type: "text/vcard;charset=utf-8" });
    const filename = `${employee[0].empname}.vcf`;
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      const vCardDataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        vCardContent
      )}`;
      const link = document.createElement("a");
      link.href = vCardDataUri;
      link.target = "_blank"; // Opens in a new tab on iOS
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  return (
    <>
      <div className="container">
        <div className="row p-4">
          <div className="col-12 text-center">
            <a className="navbar-brand" href="#">
              <img src={logo} className="img-fluid" alt="" />
            </a>
          </div>
        </div>
      </div>
      <div className="sec-header bg-blue">
        <div className="profile-card__img">
          <img
            // src="https://www.alkemites.com/alkemites/alkem/ProfileImage.aspx?userid=059347"
            src={employee[0].userprofile}
            alt="profile card"
          />
        </div>
        <div className="container-fluid">
          <div className="row text-center">
            <div className="col-12">
              <section>
                <h1>{employee[0].empname}</h1>
              </section>
              <section>
                <h2>{employee[0].designation}</h2>
              </section>
              <section>
                {/* <a
                  href=""
                  onClick={downloadVCard}
                  className="btn btn-primary btn-lg"
                  // id="content"
                >
                  {" "}
                  <i className="fa-solid fa-user-plus"></i> Save Contact
                </a> */}
                <button
                  onClick={downloadVCard}
                  className="btn btn-primary btn-lg"
                  // id="content"
                >
                  {" "}
                  <i className="fa-solid fa-user-plus"></i> Save Contact
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <ul className="deatils-list">
                <li className="env">
                  <i className="fa-solid fa-envelope"></i> Email{" "}
                  <a
                    href={`mailto:${employee[0].emailid}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span>{employee[0].emailid}</span>
                  </a>
                </li>
                <li className="mob">
                  <i className="fa-solid fa-mobile-button"></i> Mobile{" "}
                  <a
                    href={`tel:${employee[0].mobileno}`}
                    style={{ textDecoration: "none", color: "inherit" }} // Removes underline and keeps the original text color
                  >
                    <span>{employee[0].mobileno}</span>
                  </a>
                </li>
                {/* <li className="msg">
                  <i className="fa-solid fab fa-whatsapp"></i> Whats App{" "}
                  <a
                    href={`https://wa.me/${employee[0].mobileno}`}
                    target="_blank" // Opens in a new tab
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span>{employee[0].mobileno}</span>
                  </a>
                </li> */}
                <li className="loc">
                  <i className="fa-solid fa-location-dot"></i> Office Address{" "}
                  <span>
                    Alkem House, Devashish Building, Senapati Bapat Marg,Lower
                    Parel, Mumbai: 400013
                  </span>
                </li>
                <li className="globe">
                  <i className="fa-solid fa-globe"></i> Website{" "}
                  <span>
                    <a href="https://www.alkemlabs.com/" target="_blank">
                      www.alkemlabs.com
                    </a>
                  </span>
                </li>
              </ul>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
      {brands.length > 0 ? (
        <div className="bg-light1">
          <div className="container">
            <div className="row">
              <Accordion defaultActiveKey="0" id="accordionExample">
                {brands.map((brand, index) => (
                  <Accordion.Item eventKey={String(index)} key={index}>
                    <Accordion.Header>{brand.brand}</Accordion.Header>
                    <Accordion.Body>
                      {brands[index].products.map((product, index) => (
                        <div className="accr_inner_text">
                          <ul>
                            <li>
                              <strong>{product.product_name}</strong>
                              <strong> - </strong>
                              {product.composition}
                            </li>
                          </ul>
                        </div>
                        // <div className="accr_inner_text">
                        //   <strong>Alpan D Capsules Nepal Supply (15's) </strong>
                        //   <strong> - </strong>
                        //   It Pantoprazole Gastro Resistant And Domperidone Prolonged
                        //   Release Capsules Ip (40mg+30mg)
                        // </div>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
      <footer className="text-center bg-blue">
        <ul className="social-icons">
          <li>
            <a
              href="https://www.linkedin.com/company/alkem-laboratories-ltd/"
              target="new"
            >
              <img src={ld} alt="" />
            </a>
          </li>
          <li>
            {/* <a href="https://www.instagram.com/alkem_labs/" target="new"> */}
            <a
              href="https://www.instagram.com/alkem_laboratories_ltd/"
              target="new"
            >
              <img src={insta} alt="" />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/alkemlabsltd" target="new">
              <img src={fb} alt="" />
            </a>
          </li>

          <li>
            <a href="https://twitter.com/Alkem_Lab" target="new">
              <img src={twitter} alt="" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/c/ALKEMOFFICIAL" target="new">
              <img src={youtube} alt="" />
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
};

export default Profilebk;
