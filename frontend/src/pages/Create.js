import React, { useState } from "react";
import CreatePostModal from "../components/CreatePostModal";

const Create = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-heading text-trippiko-accent mb-6">Create New Travel Story</h1>
      <p className="text-trippiko-light mb-8">
        Share your travel experiences with the world! Fill out the form below to create your travel story.
      </p>
      {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Create;
