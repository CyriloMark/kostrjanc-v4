// import Firebase Library
import { getDatabase, get, ref, child } from "firebase/database";

/**
 * Fetches all current Banner Ids
 * @returns {number[]} Array of Banner Ids
 */
export default async function handleBannerContent() {
    const currentDate = Date.now();

    return await getBanners(currentDate);
}

/**
 * If I have Time I can change to return the whole Banner Data and use it
 * @param {number} currentDate Current Time in UTC+1
 * @returns {number[]} Array of Banner Ids
 */
async function getBanners(currentDate) {
    let banners = [];

    await get(child(ref(getDatabase()), `banners`))
        .then(bannersSnap => {
            if (bannersSnap.exists()) {
                //#region Check if Banners are in Time
                bannersSnap.forEach(banner => {
                    if (
                        banner.val().ending > currentDate &&
                        banner.val().starting < currentDate
                    )
                        banners.push(banner.key);
                });
                //#endregion
            }
        })
        .catch(error =>
            console.log(
                "error in constants/content/bannerContent.jsx",
                "handleBannerContent getBanners",
                error.code
            )
        );

    return banners;
}
