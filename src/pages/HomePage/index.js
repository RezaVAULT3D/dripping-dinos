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

	async function ProcessMint() {
		let gas_limit = '0x100000';
		// let gas_price = window.ethersProvider.getGasPrice(); // gasPrice

		const tx = {
			// to: contractAddress,
			value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
			// nonce: window.ethersProvider.getTransactionCount(account, 'latest'),
			gasLimit: ethers.utils.hexlify(gas_limit), // 100000
		};
		try {
			return new Promise((resolve, reject) => {
				contractAddress.mint(mintAmount, tx).then((transaction) => {
					console.dir(transaction);
					alert('Send finished!');
				});
			});
		} catch (error) {
			alert('failed to send!!');
		}
	}

	const mint = async () => {
		console.log(library);
		if (!library) return;
		// const provider = new WalletConnectProvider({
		// 	infuraId: '716d0574cc4c423a9adc0f4e451076ee',
		// });
		// // Subscribe to accounts change
		// provider.on('accountsChanged', (accounts) => {
		// 	console.log(accounts);
		// });

		// // Subscribe to chainId change
		// provider.on('chainChanged', (chainId) => {
		// 	console.log(chainId);
		// });

		// // Subscribe to session disconnection
		// provider.on('disconnect', (code, reason) => {
		// 	console.log(code, reason);
		// });

		// // Subscribe to session disconnection
		// provider.on('debug', console.log);

		try {
			console.log('entered try');
			await ProcessMint().catch((err) => console.log(err));
			console.log('after functional try');
		} catch (error) {
			console.log('we have passed into the catch');
			openAlert(
				'error',
				error.message ? error.message : 'Transaction is failed.'
			);
		}
	};

	const mintz = async () => {
		// await processMint();
		// console.log('after ' + processMint() + ' running ' + walletSigner);
		// library.on('debug', console.log);
		// new providers.Web3Provider(this.wcProvider, 'optimism');
		// try {
		// const signature = await library.request({
		// 	method: 'personal_sign',
		// 	params: [toHex(message), account],
		// });
		// const transaction = await contractAddress.mint();
		// console.log(transaction);
		// let params = {
		// 	value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
		// };
		// console.log(
		// 	await contractAddress
		// 		.mint(mintAmount, params)
		// 		.catch((err) => console.log(err))
		// );
		// console.log('RAN!');
		// const signPromise = walletSigner.signTransaction(tx, account);
		// signPromise
		// 	.then((signedTx) => {
		// 		library.sendSignedTransaction(
		// 			signedTx.rawTransaction,
		// 			function (err, hash) {
		// 				if (!err) {
		// 					console.log(
		// 						'The hash of your transaction is: ',
		// 						hash,
		// 						'\nCheck the mempool to view the status of your transaction!'
		// 					);
		// 				} else {
		// 					console.log(
		// 						'Something went wrong when submitting your transaction:',
		// 						err
		// 					);
		// 				}
		// 			}
		// 		);
		// 	})
		// 	.catch((err) => {
		// 		console.log(' Promise failed:', err);
		// 	});
		// console.log(runWalletTransaction);
		// 	setSignedMessage(message);
		// 	setSignature(signature);
		// } catch (error) {
		// 	setError(error);
		// 	console.log(error);
		// 	// openAlert('error', error);
		// }
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

// if (isConnected === true) {
// if (chainId === 1) {
// console.log('mint pressed');
// const txHash = await walletSigner.sendTransaction(tx);
// console.log('sendTrans happened?');
// console.log(txHash);
// import Web3Modal from 'web3modal';
// import { ethers } from 'ethers';
// console.log(provider);
// console.log(await provider.listAccounts());
// let tx = await // await provider.sendTransaction(tx);
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
// } else {
// openAlert('warning', 'Please choose Ethereum mainnet.');
// }
// } else {
// openAlert('error', "Ethereum object doesn't exist");
// }
