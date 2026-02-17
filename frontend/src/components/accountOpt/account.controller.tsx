// account.controller.ts
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app.context";
import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import { apiService } from "../../sevice/api.service";
import type {
  OrderItem,
  UpdateAccountRequest,
  UpdateAccountResponse,
  UserAddressItem,
} from "../../sevice/type";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AddressForm = {
  address: string;
  locality: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
};

function useAccOptController() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { showCart, showMenu, setAboutUs, setShowShop, setShowMenu, setShowPopup ,isLoginedIn,setIsLoginedIn} =
    useAppContext();

  const apiRef = useRef(apiService());
  const { getAllOrders, updateAccountDetails } = apiRef.current;

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [toggleOption, setToggleOption] = useState({ orders: true, profile: false });

  const [showEditContact, setShowEditContact] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const [profile, setProfile] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [addr, setAddr] = useState<AddressForm>({
    address: "",
    locality: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  // ✅ all addresses (cards)
  const [addresses, setAddresses] = useState<UserAddressItem[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // ✅ NEW: delete state (we'll store "key" not id because delete is match-by-fields)
  const [deletingAddressKey, setDeletingAddressKey] = useState<string | null>(null);

  // ✅ close all popups
  const closeAllPopups = useCallback(() => {
    setShowEditContact(false);
    setShowAddAddress(false);
    setShowPopup(false);
    setShowMenu(false);
  }, [setShowAddAddress, setShowEditContact, setShowMenu, setShowPopup]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        setOrders([]);
        return;
      }

      const res: any = await getAllOrders(sessionId);
      if (res?.errorCode === "NO_ERROR" && Array.isArray(res.data)) setOrders(res.data);
      else setOrders([]);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [getAllOrders]);

  // ✅ helper: stable key for address (for delete loading state + optimistic remove)
  const makeAddressKey = useCallback((a: Partial<AddressForm>) => {
    const norm = (v: any) => String(v ?? "").trim().toLowerCase();
    const normPin = (v: any) => String(v ?? "").trim();
    return [
      norm(a.address),
      norm(a.locality),
      normPin(a.pincode),
      norm(a.city),
      norm(a.state),
      norm(a.country),
    ].join("||");
  }, []);

  // ✅ Load localStorage (address + userData) and ALSO hydrate addresses[] for UI
 useEffect(() => {
  try {
    const raw = localStorage.getItem("address");
    const userData = localStorage.getItem("userData");

    // ✅ hydrate address even if userData missing
    if (raw) {
      const saved = JSON.parse(raw) as Partial<AddressForm>;

      const hasAny =
        !!saved.address ||
        !!saved.locality ||
        !!saved.pincode ||
        !!saved.city ||
        !!saved.state ||
        !!saved.country;

      if (hasAny) {
        const normalized: AddressForm = {
          address: saved.address ?? "",
          locality: saved.locality ?? "",
          pincode: saved.pincode ?? "",
          city: saved.city ?? "",
          state: saved.state ?? "",
          country: saved.country ?? "",
        };

        setAddr(normalized);

        setAddresses((prev) => {
          if (prev?.length) return prev; // don't override backend addresses
          return [
            {
              id: "local-default",
              address: normalized.address,
              locality: normalized.locality,
              pincode: normalized.pincode,
              city: normalized.city,
              state: normalized.state,
              country: normalized.country,
              isDefault: true,
            } as any,
          ];
        });
      }
    }

    // ✅ hydrate profile even if address missing
    if (userData) {
      const savedUserData = JSON.parse(userData) as Partial<ProfileForm>;

      setProfile((p) => ({
        ...p,
        firstName: savedUserData.firstName ?? p.firstName,
        lastName: savedUserData.lastName ?? p.lastName,
        email: savedUserData.email ?? p.email,
        mobile: savedUserData.phone ?? p.phone,
      }));
    }
  } catch (e) {
    console.error("Invalid localStorage address/userData:", e);
  }
}, []);


  useEffect(() => {
    if (toggleOption.orders) fetchOrders();
  }, [toggleOption.orders, fetchOrders]);

  useEffect(() => {
    if (!location.state) return;
    if ((location.state as any).orders) setToggleOption({ orders: true, profile: false });
    if ((location.state as any).profile) setToggleOption({ orders: false, profile: true });
  }, [location.state]);

  // helper: apply update response into UI state
  const applyUpdateResponse = useCallback(
    (res: UpdateAccountResponse) => {
      if (res?.errorCode !== "NO_ERROR") return;

      setProfile({
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        email: res.user.email,
        phone: res.user.phone,
      });

      const nextAddresses = Array.isArray(res.addresses) ? res.addresses : [];
      setAddresses(nextAddresses);

      // keep modal showing default (or first) for convenience
      const def = nextAddresses.find((a) => a.isDefault) || nextAddresses[0];
      if (def) {
        setAddr({
          address: def.address,
          locality: def.locality,
          pincode: def.pincode,
          city: def.city,
          state: def.state,
          country: def.country,
        });
      } else {
        setAddr({ address: "", locality: "", pincode: "", city: "", state: "", country: "" });
      }

      // ✅ keep localStorage in sync (optional but recommended)
      if (def) localStorage.setItem("address", JSON.stringify(def));
      localStorage.setItem("userData", JSON.stringify(res.user));

      closeAllPopups();
    },
    [closeAllPopups]
  );

  // ✅ Save Profile
  const saveProfile = useCallback(async () => {
    setSavingProfile(true);
    try {
      const payload: UpdateAccountRequest = {
        operation: "UPDATE",
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        mobile: profile.phone,
      };

      const res: UpdateAccountResponse = await updateAccountDetails(payload);
      applyUpdateResponse(res);
    } finally {
      setSavingProfile(false);
    }
  }, [profile, updateAccountDetails, applyUpdateResponse]);

  // ✅ Save Address
  const saveAddress = useCallback(async () => {
    setSavingAddress(true);
    try {
      const payload: UpdateAccountRequest = {
        operation: "UPDATE",
        address: addr.address,
        locality: addr.locality,
        pincode: addr.pincode,
        city: addr.city,
        state: addr.state,
        country: addr.country,
      };

      const res: UpdateAccountResponse = await updateAccountDetails(payload);
      applyUpdateResponse(res);
    } finally {
      setSavingAddress(false);
      setEditingAddressId(null);
    }
  }, [addr, updateAccountDetails, applyUpdateResponse]);

  // ✅ NEW: Delete Address (MATCH BY FULL FIELDS)
  const deleteAddress = useCallback(
    async (a: UserAddressItem) => {
      if (!a) return;

      // local-only card: remove in UI + clear localStorage if it was the same
      if (a.id === "local-default") {
        setAddresses([]);
        setAddr({ address: "", locality: "", pincode: "", city: "", state: "", country: "" });
        localStorage.removeItem("address");
        return;
      }

      const key = makeAddressKey(a);
      setDeletingAddressKey(key);

      // optimistic remove (by key, not id)
      setAddresses((prev) => prev.filter((x) => makeAddressKey(x) !== key));

      try {
        const payload: UpdateAccountRequest = {
          operation: "DELETE_ADDRESS",
          address: a.address,
          locality: a.locality,
          pincode: a.pincode,
          city: a.city,
          state: a.state,
          country: a.country,
        };

        const res: UpdateAccountResponse = await updateAccountDetails(payload);

        if (res?.errorCode === "NO_ERROR") {
          applyUpdateResponse(res);
        } else {
          // revert is optional; simplest is to refetch later
          console.error("Delete failed:", res);
        }
      } catch (e) {
        console.error("Delete address error:", e);
      } finally {
        setDeletingAddressKey(null);
      }
    },
    [applyUpdateResponse, updateAccountDetails, makeAddressKey]
  );

  return {
    navbarLeft: [
      { path: "/about", name: "OUR JOURNEY" },
      { path: "/shop", name: "SHOP" },
      { path: "/recipe", name: "RECIPES" },
    ],

    navigate,
    isMobile: useMediaQuery(theme.breakpoints.down("sm")),

    orders,
    loading,

    toggleOption,
    setToggleOption,

    showOrderDetails,
    setShowOrderDetails,
    selectedOrder,
    setSelectedOrder,

    showEditContact,
    setShowEditContact,
    showAddAddress,
    setShowAddAddress,

    profile,
    setProfile,

    addr,
    setAddr,

    addresses,
    editingAddressId,
    setEditingAddressId,

    // ✅ NEW delete exports
    deleteAddress,
    deletingAddressKey,
    makeAddressKey,

    saveProfile,
    saveAddress,
    savingProfile,
    savingAddress,

    showCart,
    showMenu,
    setAboutUs,
    setShowShop,
    setShowMenu,
    setShowPopup,
    isLoginedIn,
    setIsLoginedIn
  };
}

export { useAccOptController };
