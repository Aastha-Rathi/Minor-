import React, { useState } from "react";
// TODO: Import and use profileService for profile creation API

const initialTravelPlan = { destination: "", from: "", to: "", description: "" };

const ProfileCreation = () => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    profilePic: "",
    travelerType: "solo",
    interests: [],
    travelPlans: [initialTravelPlan],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleInterests = (e) => setForm({ ...form, interests: e.target.value.split(",") });

  const handleTravelPlanChange = (idx, e) => {
    const plans = [...form.travelPlans];
    plans[idx][e.target.name] = e.target.value;
    setForm({ ...form, travelPlans: plans });
  };

  const addTravelPlan = () => setForm({ ...form, travelPlans: [...form.travelPlans, initialTravelPlan] });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate profile creation API here
    // On success: redirect to /home
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-trippiko-bg">
      <div className="bg-trippiko-card p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-heading mb-6 text-trippiko-accent">Create Your Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} className="p-2 rounded bg-trippiko-light" required />
          <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="p-2 rounded bg-trippiko-light" required />
          <input name="profilePic" type="text" placeholder="Profile Picture URL" value={form.profilePic} onChange={handleChange} className="p-2 rounded bg-trippiko-light" />
          <select name="travelerType" value={form.travelerType} onChange={handleChange} className="p-2 rounded bg-trippiko-light">
            <option value="solo">Solo</option>
            <option value="group">Group</option>
          </select>
          <input name="interests" type="text" placeholder="Interests (comma separated)" value={form.interests.join(",")} onChange={handleInterests} className="p-2 rounded bg-trippiko-light" />
          <div>
            <h3 className="text-lg font-bold text-trippiko-accent mb-2">Travel Plans</h3>
            {form.travelPlans.map((plan, idx) => (
              <div key={idx} className="flex flex-col gap-2 mb-2 bg-trippiko-light p-2 rounded">
                <input name="destination" type="text" placeholder="Destination" value={plan.destination} onChange={(e) => handleTravelPlanChange(idx, e)} className="p-1 rounded" />
                <input name="from" type="date" value={plan.from} onChange={(e) => handleTravelPlanChange(idx, e)} className="p-1 rounded" />
                <input name="to" type="date" value={plan.to} onChange={(e) => handleTravelPlanChange(idx, e)} className="p-1 rounded" />
                <textarea name="description" placeholder="Description" value={plan.description} onChange={(e) => handleTravelPlanChange(idx, e)} className="p-1 rounded" />
              </div>
            ))}
            <button type="button" onClick={addTravelPlan} className="bg-trippiko-accent text-trippiko-dark px-2 py-1 rounded">Add Plan</button>
          </div>
          <button type="submit" className="bg-trippiko-accent text-trippiko-dark font-bold py-2 rounded">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
