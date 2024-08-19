import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import drag from "../assets/icons/drag.png";
import X from "../assets/icons/X.png";

const AdminAddPackagePage = () => {
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState([""]);

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    packages_name: "",
    merry_limit: "",
    icons: "",
    detail: "",
  });
  // การเพิ่มข้อมูลในช่อง input
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const navigate = useNavigate();
  // console.log(inputs);

    // File upload
    const handleFileChange = (e) => {
      setImage(e.target.files[0]);
    };
  
    const handleUpload = async (e) => {
      e.preventDefault();
  
      if (!image) {
        alert("Please select an image first");
        return;
      }
  
      setLoading(true);
  
      const formData = new FormData();
      formData.append("image", image);
  
      // File upload: Sending POST request with "multipart/form-data"
      try {
        const res = await axios.post(
          "http://localhost:4001/api/admin/uploadsAdmin",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setImageUrl(res.data.data.secure_url);
        alert("Image uploaded successfully");
      } catch (err) {
        console.error("Error uploading the image", err);
      } finally {
        setLoading(false);
      }
    };
  

  // เมื่อ กด create เสร็จจะเพิ่มข้อมูลและกลับไปยังหน้าlist

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericMerryLimit = parseInt(inputs.merry_limit, 10);

    if (isNaN(numericMerryLimit)) {
      console.error("Merry limit is not a valid number");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4001/admin/create",
        {
          packages_name: inputs.packages_name,
          merry_limit: numericMerryLimit,
          icons: imageUrl,
          detail: details.join(", "),
        }
      );
      console.log("Response:", res);
      alert("Package updated successfully");
      navigate("/package/view");
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("An error occurred:", error);
      }
    }
  };

  // กดปุ่ม + Add detail จะเพิ่มช่องให้เขียน detial เพิ่ม
  const handleAddDetail = () => {
    setDetails([...details, ""]);
  };

  // ลบ detail
  const handleDeleteDetail = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  // เก็บข้อมูลdetail เพื่อส่งต่อไปยัง data base
  const handleDetailChange = (index, value) => {
    const newDetails = [...details];
    newDetails[index] = value;
    setDetails(newDetails);
  };

  const handleClick = () => {
    navigate("/package/view");
  };

  return (
    <section className="w-full h-auto px-6 py-4 bg-white border-b border-gray-300 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="text-slate-800 text-2xl font-bold">Add Package</div>
        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-red-100 hover:bg-red-200 active:bg-red-300 rounded-full shadow text-rose-800 font-bold"
            onClick={handleClick}
          >
            Cancel
          </button>
          <form action="/upload" method="post">
            {/* <input type="file" name="file"> */}
            <button
              id=""
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 bg-red-500 hover:bg-red-400 active:bg-red-600 rounded-full shadow text-white font-bold"
            >
              Create
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 flex flex-col space-y-6">
        <label className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <p className="text-black">
              Package Name <span className="text-red-600">*</span>
            </p>
            <input
              type="text"
              name="packages_name"
              className="input input-bordered bg-white w-full"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-black">
              Merry limit <span className="text-red-600">*</span>
            </p>
            <input
              type="number"
              name="merry_limit"
              className="input input-bordered bg-white w-full"
              onChange={handleChange}
            />
          </div>
        </label>

<label className="w-full md:w-1/3">
        <div className="text-black">
          Icon <span className="text-red-600">*</span>
        </div>
        <div className="relative mt-2">
          {imageUrl ? (
            <div className="relative w-[130px] h-[100px]">
              <img
                className="w-[120px] h-[100px] rounded-[5px]"
                src={imageUrl}
                alt="Uploaded Icon"
              />
              <button
                className="absolute top-[-20px] right-[-20px]"
                onClick={() => setImageUrl("")}
                type="button"
              >
                <img src={X} alt="Delete Icon" />
              </button>
            </div>
          ) : (
            <>
              <div className="absolute w-[120px] h-[100px] top-0 left-0 bg-[#f6f7fc] flex justify-center items-center rounded-[5px]">
                <p>Upload Icon</p>
              </div>
              <input
                type="file"
                className="input input-bordered bg-white w-[120px] h-[100px] opacity-0"
                name="icons"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
        <form onSubmit={handleUpload}>
          <button
            type="submit"
            className="bg-rose-100 text-red-600 py-2 px-4 rounded-full mt-2 w-[120px] font-bold"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </label>

        <label className="form-control w-full">
          <h1 className="text-black">Package Detail</h1>
          {details.map((detail, index) => (
            <div key={index} className="flex flex-col mt-4">
              <p className="relative left-4 text-black">
                Detail <span className="text-red-600">*</span>
              </p>
              <div className="flex items-center">
                <img className="mr-2" src={drag} alt="Drag Icon" />
                <input
                  type="text"
                  value={detail}
                  name={`detail_${index}`}
                  onChange={(e) => handleDetailChange(index, e.target.value)}
                  className="input input-bordered bg-white w-full"
                />
                <button
                  className="ml-4 text-red-600"
                  onClick={() => handleDeleteDetail(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="px-[50px] flex-col justify-start items-start gap-2 flex mb-2 relative right-14">
            <button
              id="add-detail"
              className="px-6 py-3 bg-rose-100 rounded-[99px] shadow justify-center items-center gap-2 inline-flex"
              onClick={handleAddDetail}
            >
              <div className="text-center text-rose-800 text-base font-bold font-['Nunito'] leading-normal">
                + Add detail
              </div>
            </button>
          </div>
        </label>
      </div>
    </section>
  );
};

export default AdminAddPackagePage;


// test repo natsu