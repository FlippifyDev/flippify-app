import React, { useState, ChangeEvent, FocusEvent, useRef, useEffect } from 'react';
import { IUser, ISubscription } from '@/models/user';
import Alert from '@/app/components/Alert';
import { createCheckoutSession } from '@/services/stripe/create';


interface CardProps {
    user: IUser;
    unique_subscriptions: ISubscription[];
}

const PlansCardAdmin: React.FC<CardProps> = ({ user, unique_subscriptions }) => {
    const username = user.username;
    const email = user.email;
    const stripeCustomerId = user.stripeCustomerId;
    const subscriptions = user.subscriptions;
    const _id = user.id;

    const referral = user.referral || {
        referral_code: '',
        referral_count: 0,
        valid_referrals: [],
        rewards_claimed: 0,
    };

    const [newEmail, setNewEmail] = useState(email);
    const [selectedRoles, setSelectedRoles] = useState<ISubscription[]>(
        (subscriptions ?? []).map(sub => ({
            name: sub.name,
            id: sub.id,
            override: sub.override,
            createdAt: sub.createdAt,
        }))
    );
    const [selectedCheckoutRole, setCheckoutSelectedRole] = useState<ISubscription | null>(null);
    const [checkoutSessionUrl, setCheckoutSessionUrl] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRolesDropdownOpen, setIsRolesDropdownOpen] = useState(false);
    const [isCheckoutDropdownOpen, setIsCheckoutDropdownOpen] = useState(false);
    const [manualPriceId, setManualPriceId] = useState<string>(''); // State for manual Price ID


    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
    const inputRef = useRef<HTMLInputElement>(null); // Ref for input
    const checkoutInputRef = useRef<HTMLInputElement>(null); // Ref for input

    // Referral state
    const [referralCode, setReferralCode] = useState(referral.referralCode);
    const [rewardsClaimed, setRewardsClaimed] = useState(referral.rewardsClaimed);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value);

    const handleReferralChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value;
        if (field === 'referralCode') setReferralCode(value);
        if (field === 'rewardsClaimed') setRewardsClaimed(parseInt(value) || 0);
    };

    const isRoleSelected = (roleName: string) => selectedRoles.some(role => role.name === roleName);

    // This function now ensures that only one role is selected for checkout
    const isCheckoutRoleSelected = (roleName: string) => selectedCheckoutRole?.name === roleName;

    const handleRoleChange = (role: ISubscription) => {
        setSelectedRoles(prevRoles =>
            isRoleSelected(role.name)
                ? prevRoles.filter(r => r.name !== role.name) // Deselect the role
                : [...prevRoles, role] // Select the role
        );
    };

    const handleCheckoutRoleChange = (role: ISubscription) => {
        // Since only one role can be selected, we overwrite the previous selected role
        setCheckoutSelectedRole(prevRole => (prevRole?.name === role.name ? null : role)); // Toggle selection
    };

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertText, setAlertText] = useState("Update Successful!");

    const handleUpdate = async () => {
        try {
            const payload = {
                _id: _id,
                email: newEmail,
                subscriptions: selectedRoles,
                referral: {
                    referral_code: referralCode,
                    rewards_claimed: rewardsClaimed,
                },
            };

            console.log('Sending payload:', payload);

            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('Failed to update user data');
            }

            setAlertVisible(true); // Show the alert on success
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const filteredRoles = unique_subscriptions.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCheckoutRoles = unique_subscriptions.filter(role =>
        role.name.toLowerCase().includes("server")
    );

    const handleRolesFocus = () => setIsRolesDropdownOpen(true);
    const handleCheckoutFocus = () => setIsCheckoutDropdownOpen(true);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const relatedTarget = e.relatedTarget;
        if (
            dropdownRef.current &&
            inputRef.current &&
            checkoutInputRef.current &&
            !dropdownRef.current.contains(relatedTarget as Node) &&
            !checkoutInputRef.current.contains(relatedTarget as Node) &&
            !inputRef.current.contains(relatedTarget as Node)
        ) {
            setTimeout(() => (setIsRolesDropdownOpen(false), setIsCheckoutDropdownOpen(false)), 100);
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node) &&
            checkoutInputRef.current &&
            !checkoutInputRef.current.contains(event.target as Node)
        ) {
            setIsRolesDropdownOpen(false);
            setIsCheckoutDropdownOpen(false);
        }
    };

    const handleCreateCheckoutSession = async () => {
        if (!manualPriceId || !stripeCustomerId) {
            alert('Please enter a valid Price ID and ensure the user has a Stripe customer ID');
            return;
        }

        try {
            const { url, error } = await createCheckoutSession(
                username ?? "",
                stripeCustomerId,
                manualPriceId, // Use the manually entered price ID
                null // This param is for coupons, however no coupons apply to server subscriptions
            );

            if (error) {
                console.error('Error creating checkout session:', error);
                alert('Failed to create checkout session');
                return;
            }
            if (url) {
                setCheckoutSessionUrl(url);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('Failed to create checkout session');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="card bg-base-100 sm:w-96 w-86 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{username}</h2>
                <hr />
                <p className="grid grid-cols-12">
                    <span className="col-span-4">Email: </span>
                    <span className="col-span-8">{email}</span>
                </p>
                <p className="grid grid-cols-12">
                    <span className="col-span-4">Stripe ID: </span>
                    <span className="col-span-8">{stripeCustomerId}</span>
                </p>
                <hr />

                {/* Referral Information Editable */}
                <div className="referral-info">
                    <h3 className="font-semibold mb-4">Referral Information</h3>
                    <div className="grid grid-cols-12 gap-2">
                        <label className="col-span-6 flex items-center">Referral Code:</label>
                        <input
                            className="input input-bordered col-span-6"
                            value={referralCode}
                            onChange={(e) => handleReferralChange(e, 'referralCode')}
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-2 mt-2">
                        <label className="col-span-6 flex items-center">Rewards Claimed:</label>
                        <input
                            type="number"
                            className="input input-bordered col-span-6"
                            value={rewardsClaimed}
                            onChange={(e) => handleReferralChange(e, 'rewardsClaimed')}
                        />
                    </div>
                </div>
                <hr />

                {/* Search Input */}
                <div className="relative mt-2">
                    <h3 className="mb-2 font-semibold">Update Roles</h3>
                    <input
                        ref={inputRef} // Set ref for input
                        type="text"
                        placeholder="Search roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={handleRolesFocus}
                        onBlur={handleBlur}
                        className="input input-bordered w-full"
                    />
                    {isRolesDropdownOpen && (
                        <div ref={dropdownRef} className="absolute z-10 bg-base-100 border overflow-y-auto rounded-box shadow-lg w-full mt-1 max-h-48 overflow-hidden">
                            <ul className="menu p-2 overflow-y-auto max-h-full pt-0">
                                {filteredRoles.length > 0 ? (
                                    filteredRoles.map(role => (
                                        <li key={role.name} className="grid grid-cols-12 items-center space-x-2">
                                            <span className="col-span-10 truncate">{role.name}</span>
                                            <input
                                                type="checkbox"
                                                checked={isRoleSelected(role.name)}
                                                onChange={() => handleRoleChange(role)} // Keep the dropdown open
                                                className="checkbox col-span-2"
                                            />
                                        </li>
                                    ))
                                ) : (
                                    <li><span className="col-span-12 truncate">No roles found</span></li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Create Checkout Session */}
                <div className="relative mt-2">
                    <h3 className="mb-2 font-semibold">Create Checkout Session</h3>
                    <input
                        ref={checkoutInputRef} // Set ref for input
                        type="text"
                        placeholder="Search roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={handleCheckoutFocus}
                        onBlur={handleBlur}
                        className="input input-bordered w-full"
                    />
                    {isCheckoutDropdownOpen && (
                        <div ref={dropdownRef} className="absolute z-10 bg-base-100 border overflow-y-auto rounded-box shadow-lg w-full mt-1 max-h-48 overflow-hidden">
                            <ul className="menu p-2 overflow-y-auto max-h-full pt-0">
                                {filteredCheckoutRoles.length > 0 ? (
                                    filteredCheckoutRoles.map(role => (
                                        <li key={role.name} className="grid grid-cols-12 items-center space-x-2">
                                            <span className="col-span-10 truncate">{role.name}</span>
                                            <input
                                                type="checkbox"
                                                checked={isCheckoutRoleSelected(role.name)}
                                                onChange={() => handleCheckoutRoleChange(role)} // Keep the dropdown open
                                                className="checkbox col-span-2"
                                            />
                                        </li>
                                    ))
                                ) : (
                                    <li><span className="col-span-12 truncate">No roles found</span></li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Update Form */}
                <div className="form-control mt-2">
                    <h2 className="label font-semibold">New Email</h2>
                    <input
                        type="email"
                        className="input input-bordered"
                        value={newEmail}
                        onChange={handleEmailChange}
                    />
                    <button
                        className="btn bg-houseBlue text-white hover:bg-houseHoverBlue mt-6"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                </div>

                {/* Manual Price ID Input */}
                {selectedCheckoutRole ? (
                    <>
                        <div className="form-control mt-4">
                            <label className="label font-semibold">Enter Price ID</label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={manualPriceId}
                                onChange={(e) => setManualPriceId(e.target.value)}
                                placeholder="Enter Stripe Price ID"
                            />
                        </div>
                        {/* Create Checkout Session Button */}
                        <button
                            className="btn bg-houseBlue text-white hover:bg-houseHoverBlue mt-6"
                            onClick={handleCreateCheckoutSession}
                        >
                            Create Checkout Session
                        </button>
                    </>
                ) : null}

                {/* Copy checkout session link if available */}
                {checkoutSessionUrl && (
                    <div className="mt-4">
                        <button
                            className="btn bg-houseBlue text-white hover:bg-houseHoverBlue"
                            onClick={() => {
                                navigator.clipboard.writeText(checkoutSessionUrl)
                                    .then(() => (setAlertText("Checkout URL copied to clipboard."), setAlertVisible(true)))
                                    .catch(err => {
                                        console.error('Failed to copy link:', err);
                                        alert('Failed to copy the link. Please try again.');
                                    });
                            }}
                        >
                            Copy Checkout Link
                        </button>
                    </div>
                )}
                {/* Alert Component */}
                <Alert
                    message={alertText}
                    visible={alertVisible}
                    onClose={() => setAlertVisible(false)}
                />
            </div>
        </div>
    );
};

export default PlansCardAdmin;
