import React from "react";
import { Navbar as BsNavbar, Container } from "react-bootstrap";
import "../styles/layout.css";

export default function Navbar() {
  return (
    <BsNavbar expand="lg" className="navbar-custom shadow-sm">
      <Container fluid>
        <BsNavbar.Brand href="/" className="text-light fw-bold">
          📘 StudySpace
        </BsNavbar.Brand>
      </Container>
    </BsNavbar>
  );
}