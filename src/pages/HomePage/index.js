import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { providers, ethers } from 'ethers';
import MHidden from '../../components/@mui-extend/MHidden';
import DesktopHeroSection from './heroSections/DesktopHeroSection';
import IPadHeroSection from './heroSections/IPadHeroSection';
import IPhoneHeroSection from './heroSections/IPhoneHeroSection';
import useWallet from '../../hooks/useWallet';
import { ABI, CONTRACT_ADDRESS, NFT_PRICE } from '../../constants';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

// Providers
import Fortmatic from 'fortmatic';
import Portis from '@portis/web3';

const initialState = {
	provider: null,
	web3Provider: null,
	address: null,
	chainId: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'SET_WEB3_PROVIDER':
			return {
				...state,
				provider: action.provider,
				web3Provider: action.web3Provider,
				address: action.address,
				chainId: action.chainId,
			};
		case 'SET_ADDRESS':
			return {
				...state,
				address: action.address,
			};
		case 'SET_CHAIN_ID':
			return {
				...state,
				chainId: action.chainId,
			};
		case 'RESET_WEB3_PROVIDER':
			return initialState;
		default:
			throw new Error();
	}
}
export default function HomePage() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { provider, web3Provider, address, chainId } = state;

	const { mintAmount } = useWallet();

	const [isOpened, setIsOpened] = useState(false);
	const [severity, setSeverity] = useState('success');
	const [message, setMessage] = useState('');
	const [currentAccount, setCurrentAccount] = useState(null);

	const providerOptions = {
		portis: {
			package: Portis, // required
			options: {
				id: '4d5d11f7-29e9-4817-9576-8d1ab203a06b', // required
			},
		},
		fortmatic: {
			package: Fortmatic, // required
			options: {
				key: 'pk_live_511146DD79EC8FA6', // required
			},
		},
		walletconnect: {
			display: {
				logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
				name: 'Mobile',
				description: 'Scan qrcode with your mobile wallet',
			},
			package: WalletConnectProvider,
			options: {
				infuraId: '716d0574cc4c423a9adc0f4e451076ee', // required
			},
		},
	};

	const openAlert = (severity, message) => {
		setSeverity(severity);
		setMessage(message);
		setIsOpened(true);
	};

	let web3Modal;
	if (typeof window !== 'undefined') {
		web3Modal = new Web3Modal({
			network: 'mainnet', // optional
			cacheProvider: true,
			providerOptions, // required
		});
	}

	const connectWallet = useCallback(
		async function () {
			// This is the initial `provider` that is returned when
			// using web3Modal to connect. Can be MetaMask or WalletConnect.
			const provider = await web3Modal.connect();

			// We plug the initial `provider` into ethers.js and get back
			// a Web3Provider. This will add on methods from ethers.js and
			// event listeners such as `.on()` will be different.
			const web3Provider = new providers.Web3Provider(provider);

			const signer = web3Provider.getSigner();
			const address = await signer.getAddress();

			const network = await web3Provider.getNetwork();

			dispatch({
				type: 'SET_WEB3_PROVIDER',
				provider,
				web3Provider,
				address,
				chainId: network.chainId,
			});
		},
		[web3Modal]
	);

	const disconnectWallet = useCallback(
		async function () {
			await web3Modal.clearCachedProvider();
			if (provider?.disconnect && typeof provider.disconnect === 'function') {
				await provider.disconnect();
			}
			dispatch({
				type: 'RESET_WEB3_PROVIDER',
			});
		},
		[provider, web3Modal]
	);

	const checkWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			return openAlert('warning', 'Make sure you have Metamask installed.');
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			setCurrentAccount(account);
		} else {
			return openAlert(
				'warning',
				'No authorized account found. Please make your wallet authorized.'
			);
		}
	};

	const mint = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const chainId = ethereum.request({ method: 'eth_chainId' });
				if (chainId === '0x1') {
					// const provider = new ethers.providers.Web3Provider(ethereum);
					const instance = await web3Modal.connect();
					const provider = new ethers.providers.Web3Provider(instance);
					const signer = provider.getSigner();
					const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

					// Remove this section after testing
					// Subscribe to accounts change
					provider.on('accountsChanged', (accounts) => {
						console.log(accounts);
					});

					// Subscribe to chainId change
					provider.on('chainChanged', (chainId) => {
						console.log(chainId);
					});

					let transaction = await contract.mint(mintAmount, {
						value: ethers.utils.parseEther(String(NFT_PRICE * mintAmount)),
					});
					await transaction.wait();

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

	useEffect(() => {
		if (provider?.on) {
			const handleAccountsChanged = (accounts) => {
				// eslint-disable-next-line no-console
				console.log('accountsChanged', accounts);
				dispatch({
					type: 'SET_ADDRESS',
					address: accounts[0],
				});
			};

			// https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
			const handleChainChanged = (_hexChainId) => {
				window.location.reload();
			};

			const handleDisconnect = (error) => {
				// eslint-disable-next-line no-console
				console.log('disconnect', error);
				disconnectWallet();
			};

			provider.on('accountsChanged', handleAccountsChanged);
			provider.on('chainChanged', handleChainChanged);
			provider.on('disconnect', handleDisconnect);

			// Subscription Cleanup
			return () => {
				if (provider.removeListener) {
					provider.removeListener('accountsChanged', handleAccountsChanged);
					provider.removeListener('chainChanged', handleChainChanged);
					provider.removeListener('disconnect', handleDisconnect);
				}
			};
		}
	}, [provider, disconnectWallet]);

	useEffect(() => {
		checkWalletIsConnected();
	}, []);
	return (
		<Box height='100vh'>
			<MHidden width='mdDown'>
				<DesktopHeroSection
					currentAccount={currentAccount}
					mint={mint}
					connectWallet={connectWallet}
				/>
			</MHidden>

			<MHidden width='mdUp'>
				<MHidden width='smDown'>
					<IPadHeroSection
						currentAccount={currentAccount}
						mint={mint}
						connectWallet={connectWallet}
					/>
				</MHidden>
				<MHidden width='smUp'>
					<IPhoneHeroSection
						currentAccount={currentAccount}
						mint={mint}
						connectWallet={connectWallet}
					/>
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
