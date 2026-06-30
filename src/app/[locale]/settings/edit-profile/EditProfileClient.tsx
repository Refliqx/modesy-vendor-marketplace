"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, 
  MapPin, 
  Truck, 
  Share2, 
  Key, 
  Trash2, 
  Camera, 
  Check, 
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/actions/profile.actions";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string | null;
}

interface EditProfileClientProps {
  profile: Profile;
  email: string;
  locale: string;
  initialTab?: string;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function EditProfileClient({ profile, email, locale, initialTab = "profile" }: EditProfileClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(profile.full_name);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

  // Location states
  const [country, setCountry] = useState("Indonesia");
  const [state, setState] = useState("DKI Jakarta");
  const [city, setCity] = useState("Jakarta Selatan");

  // Address states
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Social states
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");

  // Password states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sidebarItems = [
    { id: "profile", label: "Update Profile", icon: User },
    { id: "location", label: "Location", icon: MapPin },
    { id: "shipping", label: "Shipping Address", icon: Truck },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "password", label: "Change Password", icon: Key },
    { id: "delete", label: "Delete Account", icon: Trash2 },
  ];

  // Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    setIsSubmitting(true);
    const res = await updateProfile({
      fullName,
      phoneNumber,
      avatarUrl,
    });
    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Profile updated successfully!");
      router.refresh();
    }
  };

  const handleUpdateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Location settings updated successfully!");
  };

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Shipping address saved successfully!");
  };

  const handleUpdateSocial = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Social links updated successfully!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully!");
    setPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Account deletion is disabled for demo accounts");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Settings Navigation Sidebar */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-white rounded-lg border border-gray-150 p-2 flex flex-col gap-1 shadow-sm">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  // Update URL query query params without reload
                  window.history.pushState(null, "", `/${locale}/settings/edit-profile?tab=${item.id}`);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-md transition-colors cursor-pointer w-full text-left outline-none",
                  isActive 
                    ? "bg-primary/5 text-primary" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-text-main"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="flex-1 bg-white rounded-lg border border-gray-150 p-6 shadow-sm min-h-[400px] flex flex-col">
        {/* Tab: Update Profile */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Visual Header with Mock Banner & Avatar Upload */}
            <div className="space-y-4">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Avatar & Cover</span>
              <div className="relative">
                {/* Mock Cover Banner */}
                <div className="h-32 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center border border-gray-150 group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  <button 
                    type="button"
                    onClick={() => toast.info("Cover upload is mocked in demo mode")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow transition-all cursor-pointer z-10"
                  >
                    <Camera size={15} />
                  </button>
                </div>
                {/* Profile Avatar */}
                <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow relative flex items-center justify-center group/avatar">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={fullName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-2xl font-bold uppercase select-none">
                      {fullName.charAt(0)}
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => toast.info("Avatar upload is mocked in demo mode")}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="pt-8 space-y-4">
              {/* Email Address (Confirmed) */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wide border border-green-100">
                    <Check size={8} /> Confirmed
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  disabled
                  value={slugify(fullName) || "user"}
                  className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </form>
        )}

        {/* Tab: Location */}
        {activeTab === "location" && (
          <form onSubmit={handleUpdateLocation} className="space-y-4">
            <h3 className="text-lg font-bold text-text-main mb-2 font-sans">Location Settings</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Tab: Shipping Address */}
        {activeTab === "shipping" && (
          <form onSubmit={handleUpdateAddress} className="space-y-4">
            <h3 className="text-lg font-bold text-text-main mb-2 font-sans">Shipping Address</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Street Address</label>
              <textarea
                placeholder="123 Main St, Suite 100"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-md p-3 text-sm text-text-main focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Zip Code</label>
              <input
                type="text"
                placeholder="10001"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Save Address
            </button>
          </form>
        )}

        {/* Tab: Social Media */}
        {activeTab === "social" && (
          <form onSubmit={handleUpdateSocial} className="space-y-4">
            <h3 className="text-lg font-bold text-text-main mb-2 font-sans">Social Media Links</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Facebook URL</label>
              <input
                type="url"
                placeholder="https://facebook.com/username"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Twitter URL</label>
              <input
                type="url"
                placeholder="https://twitter.com/username"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Instagram URL</label>
              <input
                type="url"
                placeholder="https://instagram.com/username"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Save Links
            </button>
          </form>
        )}

        {/* Tab: Change Password */}
        {activeTab === "password" && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h3 className="text-lg font-bold text-text-main mb-2 font-sans">Change Password</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm text-text-main focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Change Password
            </button>
          </form>
        )}

        {/* Tab: Delete Account */}
        {activeTab === "delete" && (
          <form onSubmit={handleDeleteAccount} className="space-y-6">
            <h3 className="text-lg font-bold text-red-600 mb-2 font-sans">Delete Account</h3>
            <div className="bg-red-50/50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800 leading-relaxed font-medium">
                Warning: Deleting your account will permanently remove all your data, order history, and settings from our database. This action is irreversible.
              </p>
            </div>
            <button
              type="submit"
              className="w-full h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Delete My Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
