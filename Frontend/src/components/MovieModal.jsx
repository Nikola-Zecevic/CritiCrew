import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import allMovies from "../services/moviesService";

function MovieModal() {
  const { slug } = useParams();
  const navigate = useNavigate();
  if (!slug) return null;
  const movie = allMovies.find((m) => m.slug === slug);
  if (!movie) return null;
  function handleClose() {
    navigate(-1); // vraća prethodnu stranicu
  }
  return <Modal isOpen={true} onClose={handleClose} movie={movie} />;
}

export default MovieModal;
