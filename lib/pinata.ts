import axios from "axios";

export const uploadToPinata = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Metadata for the file
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: file.name,
      })
    );

    // Pinning options
    formData.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 1,
      })
    );

    // Ensure the JWT is defined
    const jwtToken = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!jwtToken) {
      throw new Error("Missing Pinata JWT token in environment variables.");
    }

    // Upload to Pinata
    const { data } = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`, // Use JWT for authentication
        "Content-Type": "multipart/form-data",
      },
    });

    if (!data.IpfsHash) {
      throw new Error("Failed to upload to Pinata: No IPFS hash returned.");
    }

    return `ipfs://${data.IpfsHash}`;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("🚨 Pinata Upload Error:", error.response?.data || error.message);
      throw new Error(`Pinata upload failed: ${error.response?.data?.error || error.message}`);
    } else if (error instanceof Error) {
      console.error("🚨 Unexpected Error:", error.message);
      throw new Error(`Unexpected error: ${error.message}`);
    } else {
      console.error("🚨 Unknown Error:", error);
      throw new Error("An unknown error occurred.");
    }
  }
};
