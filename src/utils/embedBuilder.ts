import { APIEmbedField, EmbedBuilder, Attachment, ColorResolvable } from "discord.js";
import { Land, LandData, LandUserDetails, RoninUser } from "../types";
import fs from 'fs';
import endlessLogger from "../lib/logger";


const DESIREDORDER = ['savannah', 'forest', 'arctic', 'mystic', 'genesis'];

function sortArrayByPredefinedOrder(arr:string[]) {
    return arr.sort((a, b) => {
      const orderA = DESIREDORDER.indexOf(a);
      const orderB = DESIREDORDER.indexOf(b);
  
      if (orderA < orderB) {
        return -1;
      }
      if (orderA > orderB) {
        return 1;
      }
      return 0;
    });
  }

function findExistingProperties(land: Land): string[] {
    // Get all keys of the Land object
    const keys = Object.keys(land) as (keyof Land)[];

    // Filter keys based on whether the value is not undefined or null
    const existingProperties = keys.filter(key => land[key] !== undefined && land[key] !== null && key !== 'total');

    return sortArrayByPredefinedOrder(existingProperties);
}


export function buildPlotFields (landData: LandData): APIEmbedField[] {
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

export function buildLabelColour(landData: LandData): ColorResolvable {
    let highestOrder = findExistingProperties(landData.land).pop();
    switch (highestOrder) {
        case 'savannah':
            return '#e5763d';
        case 'forest':
            return '#4cae1a';
        case 'arctic':
            return '#a0c0d8';
        case 'mystic':
            return '#906deb';
        case 'genesis':
            return '#3994e0';
        default:
            return '#e5763d';
    }
}

function buildThumbnailImage(landData: LandData): string {
    let highestOrder = findExistingProperties(landData.land).pop();
    switch (highestOrder) {
        case 'savannah':
            return 'https://cdn.discordapp.com/attachments/1169027735444787262/1224661749194559510/jL4CNEY7kbvSOgoAAAAASUVORK5CYII.png?ex=661e4e22&is=660bd922&hm=7d6972ae389493f706e76f853b07529af856633a275e4f51f4bc41dec122e86b&';
        case 'forest':
            return 'https://cdn.discordapp.com/attachments/1169027735444787262/1224661859538436136/UP9BFlcCLSl3pYwAAAABJRU5ErkJggg.png?ex=661e4e3c&is=660bd93c&hm=3dd138c9d575d7778d368b9edb551ef095aa812d10c91b818a19c9c7da473501&';
        case 'arctic':
            return 'https://cdn.discordapp.com/attachments/1169027735444787262/1224662077633724478/mXwFQvQwzTkZYh8AAAAASUVORK5CYII.png?ex=661e4e70&is=660bd970&hm=8fd11f1198efc41bed9fd27c922e4143ee5f9da35f204d21cba4f793e6d57a0d&';
        case 'mystic':
            return 'https://cdn.discordapp.com/attachments/1169027735444787262/1224662114824749136/tJWB1aOUATAAAAAElFTkSuQmCC.png?ex=661e4e79&is=660bd979&hm=63db4aee556014ccf5d10172af3b0c6b16a2e89d8e78f2d9bc9f704a0605071d&';
        case 'genesis':
            return 'https://cdn.discordapp.com/attachments/1169027735444787262/1224662150065422438/A7tzd4VRiZQAAAAABJRU5ErkJggg.png?ex=661e4e81&is=660bd981&hm=23a269590a6488bb3fb6e45f8835043281dfd1efbe4de79c64496cd43b86f644&';
        default:
            return 'https://cdn.discordapp.com/attachments/1169027735444787262/1224661749194559510/jL4CNEY7kbvSOgoAAAAASUVORK5CYII.png?ex=661e4e22&is=660bd922&hm=7d6972ae389493f706e76f853b07529af856633a275e4f51f4bc41dec122e86b&';
    }
}

function buildUserIconUrl(landData:LandData):string{
    let highestOrder = findExistingProperties(landData.land).pop();
    switch(highestOrder){
        case 'savannah':
            return 'https://cdn.axieinfinity.com/marketplace-website/badges/20000.png';
        case 'forest':
            return 'https://cdn.axieinfinity.com/marketplace-website/badges/20001.png';
        case 'arctic':
            return 'https://cdn.axieinfinity.com/marketplace-website/badges/20002.png';
        case 'mystic':
            return 'https://cdn.axieinfinity.com/marketplace-website/badges/20003.png';
        case 'genesis':
            return 'https://cdn.axieinfinity.com/marketplace-website/badges/20004.png';
        default:
            return 'https://cdn.axieinfinity.com/marketplace-website/badges/20000.png';
    }
}

export function buildPlotDetails(landData: LandData, rns?:RoninUser):LandUserDetails{
    let landUserDetails: LandUserDetails = {
        labelColour: buildLabelColour(landData),
        shortDescription: `User Split: ${landData.payment_model.partner} Owner Split: ${landData.payment_model.owner} `,
        listingUrl: `https://delegate.axieinfinity.com/contracts/${landData.id}`,
        description: `  <:AxieInfinityShard:768531431127253043> Potenital Daily Earnings: ${landData.avg_earning.token} AXS
            :stopwatch: Contract Period: ${landData.expiration/86400 === 1 ? landData.expiration/86400 +' day':landData.expiration/86400 + ' days'}
            <a:crabwave:942086357096996872> Restriction Level: ${landData.contract_term.restriction_level}
        `,
        thumbNailImage: buildThumbnailImage(landData),
        userRonin: '',
        userIconUrl:buildUserIconUrl(landData),
        userMarketAddress: `https://app.axieinfinity.com/profile/${landData.owner}/`
    }

    if(rns){
        landUserDetails.userRonin = rns.rnsName;
    }else{
        let slicedRoninAddr = `${landData.owner.slice(0,4)}...${landData.owner.slice(landData.owner.length-4,landData.owner.length)}`;
        landUserDetails.userRonin = slicedRoninAddr;
    }
    return landUserDetails;

}



export function buildListingEmbed(landData:LandData,rns?:RoninUser):EmbedBuilder{
    let fields = buildPlotFields(landData);
    let details = buildPlotDetails(landData,rns);
    
    const listingEmbed = new EmbedBuilder()
    .setTitle(details.shortDescription)
    .setDescription(details.description)
    .setURL(details.listingUrl)
    .setColor(details.labelColour)
    .addFields(fields)
    .setThumbnail(details.thumbNailImage)
    .setAuthor({name:details.userRonin,iconURL:details.userIconUrl,url:details.userMarketAddress});

    return listingEmbed;
}