"use client";
import * as React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Button, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { t } from 'i18next';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import ListItemIcon from '@mui/material/ListItemIcon';



import '../../translate/i18n';

const Logo = styled('img')({
  height: 40,
  marginRight: 16,
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  '&:hover': {
    backgroundColor: theme.palette.grey[300]},
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: 300,
}));

const SearchIconWrapper = styled('div')({
  padding: '0 16px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export default function Navbar() {


  const router = useRouter();
  const { i18n, t } = useTranslation();
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null); // Dil menüsü için anchorEl
  const [actionAnchorEl, setActionAnchorEl] = React.useState<null | HTMLElement>(null); // Kullanıcı işlemleri menüsü için anchorEl
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  const { checkSession } = useUser();

  const handleLanguageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || undefined);
  }, []);

  const handleLanguageMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleActionMenuClose = () => {
    setActionAnchorEl(null);
  };

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router and we need to do it manually
      router.refresh();

      router.replace('/list')
      // After refresh, AuthGuard will handle the redirect
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession, router]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  const handleLogoClick = () => {
    router.push('/list'); // /list sayfasına yönlendirir
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>

      <Logo src="/assets/estate.png" alt="Logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }} />

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>

        <IconButton
          color="info"
          onClick={handleLanguageMenuClick}
          sx={{ ml: 'auto' }}
        >
          <LanguageIcon />
        </IconButton>
        <Menu
          anchorEl={langAnchorEl}
          open={Boolean(langAnchorEl)}
          onClose={handleLanguageMenuClose}
        >
          <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
          <MenuItem onClick={() => changeLanguage('tr')}>Türkçe</MenuItem>
        </Menu>

        {role ? (
          role === 'admin' ? (
            <Link href="/dashboard" passHref legacyBehavior>
              <Button
                color="info"
                startIcon={<DashboardIcon />}
              >
                {t('adminDashboard')}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/my-estate" passHref legacyBehavior>
                <Button
                  color="info"
                  startIcon={<HomeIcon />}
                >
                  {t('properties')}
                </Button>
              </Link>

              {/* Dropdown için buton */}
              <Button
                color="info"
                startIcon={<AccountCircleIcon />}
                aria-controls="action-menu"
                aria-haspopup="true"
                onClick={handleActionMenuClick}
              >
                {t('action')}
              </Button>

              {/* Dropdown menü */}
              <Menu
                id="action-menu"
                anchorEl={actionAnchorEl}
                keepMounted
                open={Boolean(actionAnchorEl)}
                onClose={handleActionMenuClose}
              >
                <MenuItem onClick={handleActionMenuClose}>
                  <Link href="/add-estate" passHref legacyBehavior>
                    <Button color="info">
                      Mülk Ekle
                    </Button>
                  </Link>
                </MenuItem>

                <MenuItem onClick={handleSignOut} >
                    <ListItemIcon>
                      <SignOutIcon fontSize="var(--icon-fontSize-md)" />
                    </ListItemIcon>
                    <Button color="info">
                        {t("signout")}
                    </Button>

                </MenuItem>
              </Menu>
            </>
          )
        ) : (
          <Link href="/auth/sign-in" passHref legacyBehavior>
            <Button
              color="info"
              startIcon={<LoginIcon />}
            >
              {isMounted ? t('login') : 'Login'}
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
