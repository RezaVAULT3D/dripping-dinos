import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { ethers, Contract, providers } from 'ethers';
import MHidden from '../../components/@mui-extend/MHidden';
import DesktopHeroSection from './heroSections/DesktopHeroSection';
import { toHex, truncateAddress } from '../../components/utils';
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
	const [account, setAccount] = useState();
	const [library, setLibrary] = useState();
	const [signedMessage, setSignedMessage] = useState('');
	const [signature, setSignature] = useState('');
	const [walletSigner, setWalletSigner] = useState(undefined);
	const [chainId, setChainId] = useState(undefined);
	const [error, setError] = useState('');

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
			setWalletSigner(signer);
			setLibrary(provider);
			setContractAddress(contract);
			setIsConnected(true);
			const accounts = await provider.accounts;
			if (accounts) setAccount(accounts[0]);
			// console.log(account);
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

	const mints = async () => {
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

			function resolve(result) {
				console.log('Resolved');
			}

			function reject(result) {
				console.error(result);
			}

			var rawTx = {
				nonce: ethers.utils.parseUnits('1').toHexString(),
				gasPrice: ethers.utils.parseUnits('20000000000').toHexString(),
				gasLimit: ethers.utils.parseUnits('30000000000').toHexString(),
				to: '0x8CDa0244D76cD48f2d3d3A7BC060FF5ed53A4C87',
				value: ethers.utils.parseUnits('0.01', 'ether').toHexString(),
				data: '0xc0de',
			};

			// console.log(ethers.utils.parseUnits('1', 'ether').toHexString());
			const txHash = await provider.sendTransaction(rawTx);
			// console.log('transactionHash is ' + txHash);

			// await provider.sendTransaction(tx).catch((err) => reject(err));

			// await provider
			// 	.listAccounts()
			// 	.then((addresses) => provider.getSigner(addresses[0]))
			// 	.then((signer) =>
			// 		signer
			// 			.sendTransaction(tx)
			// 			// .once('transactionHash', (txHash) => resolve(txHash))
			// 			.catch((err) => reject(err))
			// 	)
			// 	.catch(console.log('Error from outer promise'));

			// await provider
			// 	.listAccounts()
			// 	.then((addresses) => provider.getSigner(addresses[0]))
			// 	.then((signer) =>
			// 		signer.sendTransaction(
			// 			contractAddress
			// 				.mint(mintAmount, {
			// 					value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
			// 				})
			// 				.once('transactionHash', (txHash) => resolve(txHash))
			// 				.catch((err) => reject(err))
			// 				.catch(
			// 					openAlert(
			// 						'error',
			// 						'There was an issue. Check your wallet to make sure it has enough ETH.'
			// 					)
			// 				)
			// 		)
			// 	)
			// 	.catch(console.log('Error from outer promise'));

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

	const mint = async () => {
		if (!library) return;
		console.log(contractAddress);

		function resolve(result) {
			console.log('Resolved');
		}

		function reject(result) {
			console.error(result);
		}

		let tx = await contractAddress.mint(mintAmount, {
			value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
		});

		try {
			// const signature = await library.request({
			// 	method: 'personal_sign',
			// 	params: [toHex(message), account],
			// });
			await library
				.sendTransaction(tx)
				.once('transactionHash', (txHash) => resolve(txHash))
				.catch((err) => reject(err))
				.catch(
					openAlert(
						'error',
						'There was an issue. Check your wallet to make sure it has enough ETH.'
					)
				)

				.catch(console.log('Error from outer promise'));
			// setSignedMessage(message);
			// setSignature(signature);
			openAlert('success', 'Minted!');
		} catch (error) {
			setError(error);
			console.log(error);
			// openAlert('error', error);
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
