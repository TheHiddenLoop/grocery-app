import Address from "../models/address.model.js";
// add address :/api/address/add
export const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const savedAddress = await Address.create({
      ...req.body,   
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: savedAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//get address:// /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// delete address : /api/address/:id
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      userId, 
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addressId: id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};