import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { ethers } from "ethers";
import MHidden from '../../components/@mui-extend/MHidden';
import DesktopHeroSection from './heroSections/DesktopHeroSection';
import IPadHeroSection from './heroSections/IPadHeroSection';
import IPhoneHeroSection from './heroSections/IPhoneHeroSection';
import useWallet from '../../hooks/useWallet';
import { ABI, CONTRACT_ADDRESS, NFT_PRICE } from '../../constants';

export default function HomePage() {
  const { mintAmount } = useWallet();

  const [isOpened, setIsOpened] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  const openAlert = (severity, message) => {
    setSeverity(severity);
    setMessage(message);
    setIsOpened(true);
  };

  const mint = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        if (chainId === '0x1') {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          let transaction = await contract.mint(mintAmount, { value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)) });
          await transaction.wait();
          openAlert('success', 'Minted!');
        } else {
          openAlert('warning', 'Please choose Ethereum mainnet.');
        }
      } else {
        openAlert('error', 'Ethereum object doesn\'t exist');
      }
    } catch (error) {
      openAlert('error', error.message ? error.message : 'Transaction is failed.');
    }
  };

  return (
    <Box height="100vh">
      <MHidden width="mdDown">
        <DesktopHeroSection mint={mint} />
      </MHidden>

      <MHidden width="mdUp">
        <MHidden width="smDown">
          <IPadHeroSection mint={mint} />
        </MHidden>
        <MHidden width="smUp">
          <IPhoneHeroSection mint={mint} />
        </MHidden>
      </MHidden>

      <Snackbar
        open={isOpened}
        autoHideDuration={5000}
        onClose={() => setIsOpened(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert variant="filled" onClose={() => setIsOpened(false)} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};