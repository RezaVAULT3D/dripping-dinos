
const basePath = process.cwd();
const fs = require("fs");

const buildDir = `${basePath}/metadata`;

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
};

const startCreating = async () => {
  const namePrefix = "Dripping Dino's";
  const description = "A unique NFT collection of 8000 Dripping Dino’s";
  const baseUri =
    "https://ipfs.io/ipfs/QmYtV8CHKzDLDnQRWtSEuByWXmCJQHnjiY2HHNR9eBgwkZ/placeholder.png";

  for (let i = 0; i < 8000; i++) {
    let tempMetadata = {
      name: namePrefix,
      description: description,
      image: baseUri,
      // image: `${baseUri}/${shortName}.png`,
      // attributes: tempAttributes,
    };
    fs.writeFileSync(
      `${buildDir}/json/${i}`,
      JSON.stringify(tempMetadata, null, 2)
    );
  }
};

buildSetup();
startCreating();
