import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { ethers, Contract } from 'ethers';
import MHidden from '../../components/@mui-extend/MHidden';
import DesktopHeroSection from './heroSections/DesktopHeroSection';
import IPadHeroSection from './heroSections/IPadHeroSection';
import IPhoneHeroSection from './heroSections/IPhoneHeroSection';
import useWallet from '../../hooks/useWallet';
import { ABI, CONTRACT_ADDRESS, NFT_PRICE } from '../../constants';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default function HomePage() {
	const { mintAmount } = useWallet();

	const [isOpened, setIsOpened] = useState(false);
	const [severity, setSeverity] = useState('success');
	const [message, setMessage] = useState('');
	const [contractAddress, setContractAddress] = useState(undefined);
	const [isConnected, setIsConnected] = useState(false);
	const [walletSigner, setWalletSigner] = useState(undefined);
	const [chainId, setChainId] = useState(undefined);

	const openAlert = (severity, message) => {
		setSeverity(severity);
		setMessage(message);
		setIsOpened(true);
	};

	const getWeb3Modal = async () => {
		const web3Modal = new Web3Modal({
			network: 'mainnet',
			cacheProvider: false,
			providerOptions: {
				walletconnect: {
					package: WalletConnectProvider,
					options: {
						// infuraId: '8cf3cad623da43f9a84ab5ac94230cf6'
						infuraId: '716d0574cc4c423a9adc0f4e451076ee',
					},
				},
			},
		});
		return web3Modal;
	};
	// console.log('web3modal deets' + getWeb3Modal);
	// console.log('signer deets' + getWeb3Modal.signer);

	useEffect(() => {
		const init = async () => {
			const web3Modal = await getWeb3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const { chainId } = await provider.getNetwork();
			let contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
			setWalletSigner(connection);
			setChainId(chainId);
			setContractAddress(contract);
			setIsConnected(true);
		};
		init();
	}, []);

	// const minter = async () => {
	// 	try {

	// const connection = connectionWallet;
	// const provider = new ethers.providers.Web3Provider(connection);

	// const signer = provider.getSigner();
	// const contract =
	// 	} catch (error) {
	// 		openAlert(
	// 			'error',
	// 			error.message ? error.message : 'Transaction is failed.'
	// 		);
	// 	}
	// };

	const mint = async () => {
		try {
			if (isConnected === true) {
				if (chainId === 1) {
					let tx = await contractAddress.mint(mintAmount, {
						value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
					});

					try {
						walletSigner.sendTransaction(tx).then((transaction) => {
							console.dir(transaction);

							alert('Finished');
						});
					} catch (error) {
						alert('failed to send!!');
					}
					// // @ts-ignore
					// function sendTransaction(_tx: any) {
					// 	return new Promise((resolve, reject) => {
					// 		web3.eth
					// 			.sendTransaction(_tx)
					// 			.once('transactionHash', (txHash: string) => resolve(txHash))
					// 			.catch((err: any) => reject(err));
					// 	});
					// }

					// send transaction
					// const result = await sendTransaction(tx);

					// await transaction.wait();
					openAlert('success', 'Minted!');
				} else {
					openAlert('warning', 'Please choose Ethereum mainnet.');
				}
			} else {
				openAlert('error', "Ethereum object doesn't exist");
			}
		} catch (error) {
			openAlert(
				'error',
				error.message ? error.message : 'Transaction is failed.'
			);
		}
	};

	return (
		<Box height='100vh'>
			<MHidden width='mdDown'>
				<DesktopHeroSection mint={mint} />
			</MHidden>

			<MHidden width='mdUp'>
				<MHidden width='smDown'>
					<IPadHeroSection mint={mint} />
				</MHidden>
				<MHidden width='smUp'>
					<IPhoneHeroSection mint={mint} />
				</MHidden>
			</MHidden>

			<Snackbar
				open={isOpened}
				autoHideDuration={5000}
				onClose={() => setIsOpened(false)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					variant='filled'
					onClose={() => setIsOpened(false)}
					severity={severity}
					sx={{ width: '100%' }}
				>
					{message}
				</Alert>
			</Snackbar>
		</Box>
	);
}
