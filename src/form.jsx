import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const InputForm = () => {
  const [formData, setFormData] = useState({
    actual_transfer: "",
    massflowid: "",
    process: "",
    unitCode: "",
    date: new Date().toISOString().split("T")[0],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const dropdownOptions = [
    { label: "FM-1", value: "V30DAA02000" },
    { label: "FM-2", value: "V30DAE02000" },
    { label: "FM-3", value: "V30DAC02000" },
    { label: "FM-4", value: "W510C602000" },
    { label: "FM-5", value: "V919F502000" },
    { label: "FM-6", value: "V919F402000" },
    { label: "FM-7", value: "W5105E02000" },
    { label: "FM-8", value: "W510C702000" },
    { label: "FM-9", value: "W510C502000" },
    { label: "FM-10", value: "V919F602000" },
    { label: "FM-11", value: "V30DAD02000" },
    { label: "FM-12", value: "V30DAV02000" },
  ];

  const secondDropdownOptions = [
    { value: "bottling to charger", label: "bottling to charger" },
    { value: "blending to bottling", label: "blending to bottling" },
  ];
  const thirdDropdownOptions = [
    { value: "DISTILLERY37", label: "DISTILLERY37" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      date: new Date().toISOString().split("T")[0],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    }));
  };

  const handleSubmit = async () => {
    const requestData = {
      ...formData,
      endTime: "23:59:59",
      startTime: "00:00:00",
      time: "23:59:59",
      vendorName: "SI Energy Ventures Pvt. Ltd.",
    };
    const isValid = Object.values(requestData).every(
      (value) => value !== null && value !== undefined && value !== ""
    );

    if (!isValid) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const tokenResponse = await axios.post(
        "https://usermgmt.upexciseonline.co/userManagement/authentication/generateToken",
        {
          customerKey: "UBoFHXnRt_6UbVgIenb7L8phN7ka",
          customerSecret: "5fVt_3qgY8HfUDe6cblqsfPeumEa",
        }
      );

      const token = tokenResponse?.data?.accessToken;

      const encryptedResponse = await axios.post(
        "https://apigateway.upexciseonline.co/scmProduction/v1.0.0/tankRaidorBasedLog/massflow/encrypt",
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const decryptedResponse = await axios.post(
        "https://apigateway.upexciseonline.co/scmProduction/v1.0.0/tankRaidorBasedLog/massflow/decrypt",
        [encryptedResponse?.data?.content],
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const saveResponseAsTxt = (response) => {
        const currentTimefiletxt = new Date()
          .toLocaleTimeString()
          .replace(/:/g, "-");
        const dateNow = new Date();
        const dateOnlyTxt = dateNow.toISOString().split("T")[0];
        const timeTxt = dateNow.toLocaleTimeString().replace(/:/g, "-");
        const dateTimeTxt = `${dateOnlyTxt}_${timeTxt}`;

        const responsesObject = { [currentTimefiletxt]: response };
        const fileContent = JSON.stringify(responsesObject, null, 2);
        const blob = new Blob([fileContent], { type: "text/plain" });

        const fileName = `RESPONSE_${dateTimeTxt}.txt`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        console.log(`File "${fileName}" downloaded successfully`);
      };

      decryptedResponse?.data?.errorCode === 200
        ? (toast.success(decryptedResponse?.data?.userDisplayMesg),
          saveResponseAsTxt(decryptedResponse?.data))
        : toast.error(decryptedResponse?.data?.userDisplayMesg);
      setFormData({
        actual_transfer: "",
        massflowid: "",
        process: "",
        unitCode: "",
        date: new Date().toISOString().split("T")[0],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error("Error sending data: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            MASSFLOW METER DATA SENDER
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              SELECT FLOWMETER
            </label>
            <select
              name="massflowid"
              value={formData.massflowid}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">MASS FLOW</option>
              {dropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              SELECT PROCESS
            </label>
            <select
              name="process"
              value={formData.process}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">PROCESS</option>
              {secondDropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              SELECT UNIT CODE
            </label>
            <select
              name="unitCode"
              value={formData.unitCode}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">UNITCODE</option>
              {thirdDropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              MASS FLOW READING
            </label>
            <input
              type="number"
              name="actual_transfer"
              value={formData.actual_transfer}
              onChange={handleChange}
              placeholder="ENTER ACTUAL TRANSFER"
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full p-2 sm:p-3 rounded-lg font-medium text-white text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;