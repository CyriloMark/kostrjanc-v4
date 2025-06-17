export const colors = {
    //old
    // blue: "#5884B0",
    // sec: "#143C63",
    // red: "#B06E6A",
    // black: "#000000",
    // white: "#ffffff",
    //new
    blue: "#5884B0",
    sec: "#143C63",
    red: "#e23b32",
    black: "#060A0D",
    white: "#CCE6FF",
};

export const colorsRGB = {
    blue: "88, 132, 176",
    sec: "20, 60, 99",
    red: "226, 59, 50",
    black: "6, 10, 13",
    white: "204, 230, 255",
};

export const container = {
    flex: 1,
    width: "100%",
};
export const allMax = {
    width: "100%",
    height: "100%",
};

export const bgBlue = {
    backgroundColor: colors.blue,
};
export const bgBlack = {
    backgroundColor: colors.black,
};
export const bgWhite = {
    backgroundColor: colors.white,
};
export const bgSec = {
    backgroundColor: colors.sec,
};
export const bgRed = {
    backgroundColor: colors.red,
};

export const Psm = {
    paddingHorizontal: 10,
    paddingVertical: 5,
};
export const Pmd = {
    paddingHorizontal: 15,
    paddingVertical: 10,
};
export const Plg = {
    paddingHorizontal: 25,
    paddingVertical: 15,
};

export const TsmLt = {
    fontFamily: "RobotoMono_Thin",
    fontSize: 13,
    // fontSize: 12,
};
export const TsmRg = {
    fontFamily: "Barlow_Regular",
    fontSize: 12,
};
export const Tmd = {
    fontFamily: "Barlow_Regular",
    fontSize: 16,
};
export const TlgRg = {
    fontFamily: "Barlow_Regular",
    fontSize: 24,
};
export const TlgBd = {
    fontFamily: "Barlow_Bold",
    fontSize: 24,
};
export const Ttitle2 = {
    fontFamily: "Barlow_Bold",
    fontSize: 36,
};
export const Ttitle = {
    fontFamily: "Barlow_Bold",
    fontSize: 58,
};

export const tBlue = {
    color: colors.blue,
};
export const tWhite = {
    color: colors.white,
};
export const tSec = {
    color: colors.sec,
};
export const tBlack = {
    color: colors.black,
};
export const tRed = {
    color: colors.red,
};

export const readableText = {
    textDecorationStyle: "dashed",
    textDecorationColor: colors.sec,
    textDecorationLine: "underline",
};

export const boxShadow = {
    shadowColor: colors.black,
    shadowOffset: {
        width: 0,
        height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
};

export const oVisible = {
    overflow: "visible",
};
export const oHidden = {
    overflow: "hidden",
};

export const defaultMsm = 5;
export const defaultMmd = 10;
export const defaultMlg = 25;

export const pV = {
    paddingVertical: Psm.paddingVertical,
};
export const pH = {
    paddingHorizontal: Psm.paddingHorizontal,
};

export const border = {
    borderWidth: 1,
    borderStyle: "solid",
};

export const allCenter = {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
};

export const tCenter = {
    textAlign: "center",
};

export const line = {
    width: "50%",
    height: 1,
    backgroundColor: colors.blue,
    alignSelf: "center",
};

export const blurBox = {
    position: "absolute",
    zIndex: 5,
    ...allMax,
};

export const shadowSec = {
    // Shadow
    shadowColor: colors.sec,
    shadowRadius: 15,
    shadowOpacity: 0.5,
    // shadowOpacity: 1,
    shadowOffset: {
        width: 0,
        height: 0,
    },
    backgroundColor: colors.black,
};
export const shadowSecSmall = {
    // Shadow
    shadowColor: colors.sec,
    shadowRadius: 10,
    shadowOpacity: 0.33,
    // shadowOpacity: 1,
    shadowOffset: {
        width: 0,
        height: 0,
    },
    backgroundColor: colors.black,
};
export const shadowRed = {
    // Shadow
    shadowColor: colors.red,
    shadowRadius: 15,
    shadowOpacity: 0.33,
    // shadowOpacity: 1,
    shadowOffset: {
        width: 0,
        height: 0,
    },
    backgroundColor: colors.black,
};
