import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { ethers, Contract, providers } from 'ethers';
import MHidden from '../../components/@mui-extend/MHidden';
import DesktopHeroSection from './heroSections/DesktopHeroSection';
import IPadHeroSection from './heroSections/IPadHeroSection';
import IPhoneHeroSection from './heroSections/IPhoneHeroSection';
// import useWallet from '../../hooks/useWallet';
import { ABI, CONTRACT_ADDRESS, NFT_PRICE } from '../../constants';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default function HomePage() {
	// const { mintAmount } = useWallet();

	const mintAmount = 1;

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

	// const getWeb3Modal = async () => {
	// 	const web3Modal = new Web3Modal({
	// 		network: 'mainnet',
	// 		cacheProvider: false,
	// 		providerOptions: {
	// 			walletconnect: {
	// 				package: WalletConnectProvider,
	// 				options: {
	// 					// infuraId: '8cf3cad623da43f9a84ab5ac94230cf6'
	// 					infuraId: '716d0574cc4c423a9adc0f4e451076ee',
	// 				},
	// 			},
	// 		},
	// 	});
	// 	return web3Modal;
	// };
	// console.log('web3modal deets' + getWeb3Modal);
	// console.log('signer deets' + getWeb3Modal.signer);
	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				// infuraId: '8cf3cad623da43f9a84ab5ac94230cf6'
				infuraId: '716d0574cc4c423a9adc0f4e451076ee',
			},
		},
	};

	useEffect(() => {
		const init = async () => {
			const provider = new WalletConnectProvider({
				infuraId: '716d0574cc4c423a9adc0f4e451076ee',
			});
			const web3Provider = new providers.Web3Provider(provider);

			const signer = web3Provider.getSigner();

			setWalletSigner(signer);

			await provider.enable();

			// Subscribe to accounts change
			provider.on('accountsChanged', (accounts) => {
				console.log(accounts);
			});

			// Subscribe to chainId change
			provider.on('chainChanged', (chainId) => {
				console.log(chainId);
			});

			// Subscribe to session disconnection
			provider.on('disconnect', (code, reason) => {
				console.log(code, reason);
			});

			// const { chainId } = await provider.getNetwork();
			let contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
			// setWalletSigner(connection);
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

	const clearCache = async () => {
		const provider = new WalletConnectProvider({
			infuraId: '716d0574cc4c423a9adc0f4e451076ee',
		});

		await provider.enable();
	};

	const mint = async () => {
		try {
			// if (isConnected === true) {
			// if (chainId === 1) {
			// console.log('mint pressed');

			// const txHash = await walletSigner.sendTransaction(tx);

			// console.log('sendTrans happened?');

			// console.log(txHash);

			// import Web3Modal from 'web3modal';
			// import { ethers } from 'ethers';

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

			const connection = await web3Modal.connect();

			const provider = new ethers.providers.Web3Provider(connection);

			const signer = provider.getSigner();

			// console.log(provider);

			// console.log(await provider.listAccounts());

			// let tx = await // await provider.sendTransaction(tx);

			await provider
				.listAccounts()
				.then((addresses) => provider.getSigner(addresses[0]))
				.then((signer) =>
					signer.sendTransaction(
						contractAddress.mint(mintAmount, {
							value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
						})
					)
				)
				.catch(() => console.log('Error from outer promise'));

			// await walletSigner.signTransaction(tx);

			// let wallet = walletSigner;

			// await wallet.getBalance();
			// await wallet.getTransactionCount();
			// await walletSigner.sendTransaction();

			// await contractAddress.mint(mintAmount, {
			// 	value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
			// });

			// console.log('mint amount: ' + mintAmount);

			// console.log('wallet signer: ' + walletSigner.sendTransaction(tx));

			// openAlert('success', 'tx passed');

			// walletSigner.sendTransaction(tx).then((transaction) => {
			// 	console.dir(transaction);

			// 	// alert('Finished');
			// });

			// openAlert('success', 'sendTransaction executed');

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
			// const txHash = await web3.eth.sendTransaction(tx);

			// await transaction.wait();
			openAlert('success', 'Minted!');
			// } else {
			// openAlert('warning', 'Please choose Ethereum mainnet.');
			// }
			// } else {
			// openAlert('error', "Ethereum object doesn't exist");
			// }
		} catch (error) {
			console.log('we have passed into the catch');
			console.log(error.message ? error.message : 'Transaction is failed.');
			// openAlert(
			// 	'error',
			// 	error.message ? error.message : 'Transaction is failed.'
			// );
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

			<span onClick={clearCache}>Clear cached provider</span>

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
