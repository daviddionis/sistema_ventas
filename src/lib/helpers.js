const helpers={};
const bcrypt=require('bcryptjs');

helpers.encriptarContra=async (password)=>{
    const salt=await bcrypt.genSalt(11);
    return (await bcrypt.hash(password, salt));
};
helpers.compararContra=async (password, passwordEnBD)=>{
    try{
        return await bcrypt.compare(password, passwordEnBD);
    }catch(e){
        console.log(e);
    }
};

module.exports=helpers;