import { APIEmbedField, EmbedBuilder } from "discord.js";
import { LandData, LandUserDetails, RoninUser } from "../types";

export function buildForestFields (landData: LandData): APIEmbedField[] {
    let fields: APIEmbedField[] = [];
    landData.land && Object.entries(landData.land).forEach(([key, value]) => {
        if (key === 'total') return;
        fields.push({
            name: key,
            value: value.toString(),
            inline: true
        });
    });
    return fields;
}

export function buildPlotDetails(landData: LandData, rns?:RoninUser):LandUserDetails{
    let landUserDetails: LandUserDetails = {
        labelColour: '#07ec5f',
        shortDescription: `User Split: ${landData.payment_model.partner} Owner Split: ${landData.payment_model.owner} `,
        listingUrl: `https://delegate.axieinfinity.com/contracts/${landData.id}`,
        description: `  :AxieInfinityShard~1: Potenital Daily Earnings: ${landData.avg_earning.token} AXS
            :stopwatch: Contract Period: ${landData.expiration/86400 === 1 ? landData.expiration/86400 +' day':landData.expiration/86400 + ' days'}
            :crabwave: Restriction Level: ${landData.contract_term.restriction_level}
        `,
        thumbNailImage: `https://cdn.discordapp.com/attachments/789470313154215966/1219770167710449705/0IexCxWy8qAAAAAElFTkSuQmCC.png?ex=660c827e&is=65fa0d7e&hm=80c1b53c78ff4fdefff2439de323b2d948a3147c34ee9d90d0ef00a56f850d9a&`,
        majorImage: `https://cdn.discordapp.com/attachments/772598645916041227/1219601754220527698/land_delegation_noti.png?ex=660be5a5&is=65f970a5&hm=a9b2d852879371936efaeabe7ed692ffce656fed6a530d27cf331625cfd42b38&`,
        userRonin: '',
        userIconUrl:`https://cdn.axieinfinity.com/marketplace-website/badges/20001.png`,
        userMarketAddress: `https://app.axieinfinity.com/profile/${landData.owner.replace('0x','ronin:')}/`
    }

    if(rns){
        landUserDetails.userRonin = rns.rnsName;
    }else{
        landUserDetails.userRonin = landData.owner;
    }
    return landUserDetails;

}

export function buildListingEmbed(landData:LandData,rns?:RoninUser):EmbedBuilder{
    let fields = buildForestFields(landData);
    let details = buildPlotDetails(landData,rns);
    
    const listingEmbed = new EmbedBuilder()
    .setTitle(details.shortDescription)
    .setColor(details.labelColour)
    .setDescription(details.description)
    .addFields(fields)
    .setThumbnail(details.thumbNailImage)
    .setImage(details.majorImage)
    .setAuthor({name:details.userRonin,iconURL:details.userIconUrl,url:details.userMarketAddress});

    return listingEmbed;
}