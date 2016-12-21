module.exports.MappedTables  = [{
    codigo:'I/337/gaia',
    columns: {
        ra:"ra",
        erroRA:"ra_error",
        dec:"dec",
        erroDec:"dec_error",
        epochRA:"ref_epoch",
        epochDec:"ref_epoch",
        pmRA:"pmRA",
        error_pmRA:"pmra_error",
        pm_dec:"pmdec",
        error_pmDec:"pmdec_error"
    }
}, {
    codigo:'I/337/tgas',
    columns: {
        ra: "ra",
        erroRA: "ra_error",
        dec: "dec",
        erroDec: "dec_error",
        epochRA: "ref_epoch",
        epochDec: "ref_epoch",
        pmRA: "pmRA",
        error_pmRA: "pmra_error",
        pm_dec: "pmdec",
        error_pmDec: "pmdec_error"
    }
},
    {
    codigo:'I/259/tyc2',
    columns: {
        ra: "RA(ICRS)",
        erroRA: "e_RAdeg",
        dec: "DE(ICRS)",
        erroDec: "e_DEdeg",
        epochRA: "'1990'",
        epochDec: "'1990'",
        pmRA: "pmRA",
        error_pmRA: "e_pmRA",
        pm_dec: "pmDE",
        error_pmDec: "e_pmDE"
    }
},
    {
    codigo:'I/239/hip_main',
    columns: {
        ra: "RA(ICRS)",
        erroRA: "e_RAdeg",
        dec: "DE(ICRS)",
        erroDec: "e_DEdeg",
        epochRA: "'1991.25'",
        epochDec: "'1991.25'",
        pmRA: "pmRA",
        error_pmRA: "e_pmRA",
        pm_dec: "pmDE",
        error_pmDec: "e_pmDE"
    }
}];


