import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import InputField from "../InputField";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CircleIcon from "@mui/icons-material/Circle";
import "../../styles/component.css";
import "../../styles/auction.css";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonButton from "../CommonButton";
import { getVehicleInfo } from "@/src/redux/action/vehicle";
import VehicleView from "./VehicleView";
import { getCustomerInfo } from "@/src/redux/action/customer";
import CustomerView from "./CustomerView";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import { deleteBidFromAuction } from "@/src/redux/action/auction";
import { useDispatch } from "react-redux";
import { setLoading } from "@/src/redux/reducer/loaderSlice";
const AuctionView = (props) => {
  const dispatch = useDispatch();
  const { show, onHide, auctionDetails } = props;
  const [showViewModal, setShowViewModal] = useState(false);
  const [showViewModal2, setShowViewModal2] = useState(false);
  const [selectedVehicledata, setSelectedVehicledata] = useState(null);
  const [selectedCustomerdata, setSelectedCustomerdata] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({});
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "#17B530 ";
      case "Pending":
        return "#FFBE18";
      default:
        return "#F73B3B";
    }
  };

  useEffect(() => {
    const vehicleId = auctionDetails?.vehicleId;
    if (vehicleId) {
      getVehicleInfo(vehicleId, (res) => {
        if (res?.data) {
          setSelectedVehicledata(res?.data);
        } else {
          toast.error("Error fetching Customer details");
        }
      });
    }
  }, [auctionDetails]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (auctionDetails?.biddinghistory) {
        const customerIds = auctionDetails?.biddinghistory?.map(
          (bid) => bid?.customerId
        );
        const uniqueCustomerIds = [...new Set(customerIds)];

        uniqueCustomerIds?.forEach((customerId) => {
          getCustomerInfo(customerId, (res) => {
            if (res?.data) {
              setCustomerDetails((prevState) => ({
                ...prevState,
                [customerId]: res?.data,
              }));
              
            } else {
              toast.error("Error fetching customer details");
              
            }
          });
        });
      }
    };
    fetchCustomerDetails();
  }, [auctionDetails]);

  const OpenVehicleViewModal = () => {
    setShowViewModal(true);
  };
  const OpenCustomerViewModal = (customerId) => {
    const customerData = customerDetails[customerId];
    if (customerData) {
      setSelectedCustomerdata(customerData);
      setShowViewModal2(true);
    }
  };

  const openDeleteConfirmationModal = (bidId) => {
    setSelectedBidId(bidId);
    setDeleteConfirmationModal(true);
  };

  const closeDeleteConfirmationModal = () => {
    setDeleteConfirmationModal(false);
  };

  const handleDeleteBid = (bidId) => {
    dispatch(setLoading(true));
    if (auctionDetails?._id) {
      deleteBidFromAuction(auctionDetails?._id, bidId, (res) => {
        if (res?.status === 200) {
          const updatedBiddingHistory = auctionDetails?.biddinghistory?.filter(
            (bid) => bid?._id !== bidId
          );
          auctionDetails.biddinghistory = updatedBiddingHistory;
          toast.success("Bid removed successfully");
          dispatch(setLoading(false));
          closeDeleteConfirmationModal();
        } else {
          toast.error("Failed to remove bid");
          dispatch(setLoading(false));
          closeDeleteConfirmationModal();
        }
      });
    }
  };

  const biddingHis = auctionDetails?.biddinghistory;

  return (
    <div>
      {!showViewModal && !showViewModal2 && !deleteConfirmationModal && (
        <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
          <Modal.Header className="header-outer d-flex justify-content-between">
            <Modal.Title className="Modal-Title">
              Auction Details View
            </Modal.Title>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div
                className="fw-bold"
                style={{ color: "var(--primary-color)" }}
              >
                {auctionDetails?.status}
              </div>
              <IconButton>
                <CircleIcon
                  sx={{
                    color: getStatusColor(auctionDetails?.status),
                  }}
                />
              </IconButton>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <div className="row pb-3">
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <InputField
                    label={"Auction RefID"}
                    disable={true}
                    defaultValue={auctionDetails?.auctionRefID}
                  />
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <InputField
                    label={"Vehicle Register No"}
                    disable={true}
                    defaultValue={selectedVehicledata?.registerno}
                  />
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <InputField
                    label={"Start Bidding Price"}
                    disable={true}
                    defaultValue={`Rs ${auctionDetails?.bidstartprice}`}
                  />
                </div>
              </div>
              <div className="row pb-3">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <InputField
                    label={"Auction Start Date"}
                    disable={true}
                    defaultValue={auctionDetails?.startDate}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <InputField
                    label={"Auction End Date"}
                    disable={true}
                    defaultValue={auctionDetails?.endDate}
                  />
                </div>
              </div>
              <div className="row pb-3">
                <div className="form-group">
                  <label htmlFor="input-field" className="Text-input-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    disabled
                    defaultValue={auctionDetails?.description}
                    rows={3}
                  />
                </div>
              </div>
              <hr />
              <div className="row pb-3">
                <div className="col-lg-6 col-md-6 col-sm-12 ps-3 pe-3 Auction-ViewModal-Bid-List">
                  <label
                    htmlFor="features-dropdown"
                    className="Text-input-label mb-3"
                  >
                    Auction Details
                  </label>
                  {biddingHis?.length > 0 ? (
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Bidding Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {biddingHis?.map((data, index) => (
                          <tr key={index}>
                            <td>
                              {customerDetails[data?.customerId]
                                ? customerDetails[data?.customerId]?.fname
                                : data?.customerId}
                            </td>
                            <td>{`LKR ${data?.biddingprice}`}</td>
                            <td>
                              <IconButton
                                aria-label="view"
                                className="viewbutt"
                                onClick={() =>
                                  OpenCustomerViewModal(data?.customerId)
                                }
                              >
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton
                                aria-label="view"
                                className="viewbutt"
                                onClick={() =>
                                  openDeleteConfirmationModal(data?._id)
                                }
                              >
                                <DeleteIcon className="text-danger" />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No bidding history available</p>
                  )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 ps-5 pe-2">
                  <label
                    htmlFor="features-dropdown"
                    className="Text-input-label mb-3"
                  >
                    Vehicle Details
                  </label>
                  <CommonButton
                    text={"Vehicle Detail"}
                    width={"100%"}
                    onClick={OpenVehicleViewModal}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <VehicleView
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        vehicleDetails={selectedVehicledata}
        hidecustomerdetails
      />
      <CustomerView
        show={showViewModal2}
        onHide={() => setShowViewModal2(false)}
        customerDetails={selectedCustomerdata}
      />
      <ConfirmationModal
        show={deleteConfirmationModal}
        message="Are you sure you want to delete this bid?"
        heading="Confirmation Delete!"
        variant="danger"
        onConfirm={() => handleDeleteBid(selectedBidId)}
        onCancel={closeDeleteConfirmationModal}
      />
    </div>
  );
};

export default AuctionView;
