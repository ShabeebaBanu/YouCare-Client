import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getApproveNeedByNeedId } from "@/services/approveNeedService";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import { getDonationRequestByDonationId } from "@/services/donationRequestService";

function CompleteDetail() {
  const { id } = useLocalSearchParams();
  const { type } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !type) return;

      try {
        if (type === "Need") {
          const res = await getApproveNeedByNeedId(id);
          setData(res.data);
        } else if (type === "Donation") {
          const res = await getDonationRequestByDonationId(id);
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch details:", err);
      }
    };

    fetchData();
  }, [id, type]);

  if (!data) {
    return <div style={styles.loading}>Loading details...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Donation Summary</h1>

      {/* Donation Details Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {data.donationDetail.image && (
            <img
              src={data.donationDetail.image ? data.donationDetail.image : ""}
              alt="Donation"
              style={styles.mainImage}
            />
          )}
          <div style={styles.cardHeaderText}>
            <h2 style={styles.sectionTitle}>{data.donationDetail.title}</h2>
            <p style={styles.metaText}>{data.donationDetail.item} • {data.donationDetail.category}</p>
            <span style={styles.statusTag}>{data.donationDetail.status}</span>
          </div>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.infoRow}><strong>Description:</strong> {data.donationDetail.description}</div>
          <div style={styles.infoRow}><strong>Quantity:</strong> {data.donationDetail.quantity}</div>
          {/* <div style={styles.infoRow}><strong>District:</strong> {data.donationDetail.district}</div> */}
          {data.donationDetail.delivery && <div style={styles.infoRow}><strong>Delivery:</strong> {data.donationDetail.delivery}</div>}
        </div>
        {/* {data.donationDetail.image && (
          <div style={styles.imageGallery}>
            {Array.isArray(data.donationDetail.image)
              ? data.donationDetail.image.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Donation" style={styles.galleryImg} />
                ))
              : <img src={data.donationDetail.image} alt="Donation" style={styles.galleryImg} />}
          </div>
        )} */}
      </div>

      {/* Needy Details */}
      <div style={styles.infoSection}>
        <h2 style={styles.sectionSubtitle}>Needy Details</h2>
        <div style={styles.infoGrid}>
          <span>Name:</span> <span>{data.needyDetails.username}</span>
          <span>District:</span> <span>{data.needyDetails.district}</span>
          <span>Province:</span> <span>{data.needyDetails.province}</span>
          <span>Address:</span> <span>{data.needyDetails.address}</span>
          <span>Phone:</span> <span>{data.needyDetails.phone}</span>
          {data.needyDetails.organizationName && (
            <>
              <span>Organization:</span> <span>{data.needyDetails.organizationName}</span>
            </>
          )}
          {data.needyDetails.organizationAddress && (
            <>
              <span>Organization Address:</span> <span>{data.needyDetails.organizationAddress}</span>
            </>
          )}
        </div>
      </div>

      {/* Donor Details */}
      <div style={styles.infoSection}>
        <h2 style={styles.sectionSubtitle}>Donor Details</h2>
        <div style={styles.infoGrid}>
          <span>Name:</span> <span>{data.donorDetails.username}</span>
          <span>Phone:</span> <span>{data.donorDetails.phone}</span>
          <span>District:</span> <span>{data.donorDetails.district}</span>
          <span>Province:</span> <span>{data.donorDetails.province}</span>
          <span>Address:</span> <span>{data.donorDetails.address}</span>
          {data.donorDetails.organizationName && (
            <>
              <span>Organization:</span> <span>{data.donorDetails.organizationName}</span>
            </>
          )}
          {data.donorDetails.organizationAddress && (
            <>
              <span>Organization Address:</span> <span>{data.donorDetails.organizationAddress}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompleteDetail;

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    maxWidth: "900px",
    //margin: "20px auto",
    padding: "20px",
    fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
    color: COLORS.textDark,
    overflowY: "auto",
    height: "100vh",
    backgroundColor: COLORS.white
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "20px",
    color: COLORS.textDark,
  },
  card: {
    background: COLORS.bgLight,
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.29)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  mainImage: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
    border: COLORS.bgGray,
  },
  cardHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: SIZE.medium,
    fontWeight: "600",
    marginBottom: "2px",
    color: COLORS.textOption,
  },
  sectionSubtitle: {
    fontSize: SIZE.medium,
    fontWeight: "600",
    marginBottom: "10px",
    color: COLORS.textOption,
    textDecoration: "underline",  
    borderLeft: "none",           
    paddingLeft: "0px",            
  },
  metaText: {
    fontSize: "12px",
    color: COLORS.textPlaceHolder,
    marginBottom: "4px",
  },
  statusTag: {
    fontSize: SIZE.small,
    backgroundColor: COLORS.buttonAccept,
    color: COLORS.bgGray,
    padding: "3px 8px",
    borderRadius: "5px",
    fontWeight: "500",
    display: "inline-block",
  },
  cardBody: {
    fontSize: SIZE.small,
    color: COLORS.textgray,
    lineHeight: "1.4",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  imageGallery: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    overflowX: "auto",
  },
  galleryImg: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  infoSection: {
    padding: "5px",
    marginBottom: "15px",
    fontSize: "13px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gap: "6px 15px",
  },
  loading: {
    textAlign: "center",
    padding: "30px",
    color: "#888",
    fontSize: "14px",
  },
};
