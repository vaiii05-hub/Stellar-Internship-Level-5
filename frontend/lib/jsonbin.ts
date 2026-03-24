const MASTER_KEY = process.env.NEXT_PUBLIC_JSONBIN_KEY!;
const BASE_URL = "https://api.jsonbin.io/v3";
 
// Create a new gift drop
export const createGiftDrop = async (giftData: any): Promise<string> => {
  const response = await fetch(BASE_URL + "/b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY,
      "X-Bin-Name": "giftdrop-" + giftData.id,
      "X-Bin-Private": "false",
    },
    body: JSON.stringify(giftData),
  });
  const data = await response.json();
  return data.metadata.id;
};
 
// Get a gift drop by bin ID
export const getGiftDrop = async (binId: string): Promise<any> => {
  const response = await fetch(BASE_URL + "/b/" + binId + "/latest", {
    headers: { "X-Master-Key": MASTER_KEY },
  });
  const data = await response.json();
  return data.record;
};
 
// Update a gift drop
export const updateGiftDrop = async (binId: string, giftData: any): Promise<void> => {
  await fetch(BASE_URL + "/b/" + binId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY,
    },
    body: JSON.stringify(giftData),
  });
};
 
// Delete a gift drop
export const deleteGiftDrop = async (binId: string): Promise<void> => {
  await fetch(BASE_URL + "/b/" + binId, {
    method: "DELETE",
    headers: { "X-Master-Key": MASTER_KEY },
  });
};
 
// Get all bins from JSONBin account
export const getAllBins = async (): Promise<any[]> => {
  try {
    const response = await fetch(BASE_URL + "/b?page=1&count=100", {
      headers: { "X-Master-Key": MASTER_KEY },
    });
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.filter((b: any) =>
      b.snippetMeta?.name?.startsWith("giftdrop-")
    );
  } catch {
    return [];
  }
};
 
// Get drops by wallet address
export const getDropsByWallet = async (
  walletAddress: string
): Promise<{ organised: any[]; contributed: any[] }> => {
  const organised: any[] = [];
  const contributed: any[] = [];
 
  try {
    const bins = await getAllBins();
 
    await Promise.all(
      bins.map(async (bin: any) => {
        try {
          const drop = await getGiftDrop(bin.id);
          if (!drop) return;
 
          const dropWithId = { ...drop, binId: bin.id };
 
          if (drop.organiser === walletAddress) {
            organised.push(dropWithId);
          } else {
            const isContributor = (drop.contributors || []).some(
              (c: any) => c.address === walletAddress
            );
            if (isContributor) {
              contributed.push(dropWithId);
            }
          }
        } catch {
          // skip failed bins
        }
      })
    );
  } catch {
    // return empty arrays on error
  }
 
  return { organised, contributed };
};
 