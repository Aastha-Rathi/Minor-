import React, { useState } from "react";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate contact form API if needed
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-xl mx-auto bg-trippiko-card p-8 rounded-lg shadow text-trippiko-light">
      <h1 className="text-2xl font-heading text-trippiko-accent mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="p-2 rounded bg-trippiko-light text-trippiko-dark" required />
        <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} className="p-2 rounded bg-trippiko-light text-trippiko-dark" required />
        <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} className="p-2 rounded bg-trippiko-light text-trippiko-dark" required />
        <button type="submit" className="bg-trippiko-accent text-trippiko-dark px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default ContactUs;
