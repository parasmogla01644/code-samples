import React from "react";
import clsx from "clsx";
import { createRoot } from "react-dom/client";
import axios from "axios";

// icons
import { ReactComponent as ControllerIcon } from "assets/images/controller.svg";
import { ReactComponent as SocialIcon } from "assets/images/social.svg";
import { ReactComponent as LiveIcon } from "assets/images/alarm.svg";
import { ReactComponent as UnionIcon } from "assets/images/union.svg";
import { ReactComponent as ProfileIcon } from "assets/images/profile.svg";
import { ReactComponent as SearchIcon } from "assets/images/search.svg";

import styles from "./FooterNavigation.module.scss";

interface OverrideMenuOption {
  id?: number
  label?: string
  url?: string
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

// TODO: Test array limit, so we can prevent clients from injecting more than 4 submenus
// This is unclear territory - it must be discussed with Adam
// type ArrayOfMaxLength4 = readonly [
//   OverrideMenuOption?, OverrideMenuOption?, OverrideMenuOption?, OverrideMenuOption?
// ];

interface MenuOption {
  id?: number
  label: string
  url: string
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

interface FooterNavigationProps {
  productId: number
  currentRoute: string
  betslipItems: number
  totalOdds: number
  isRelative?: boolean
  menuOptions?: OverrideMenuOption[]
}

interface FooterNavigationTabProps {
  tabClickHandler: (route: string) => () => void
  currentRoute: string
  routeTo: string
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>
  label: string
}

const defaultOptions = [
  {
    id: 1,
    label: "Home",
    url: "/",
    Icon: ControllerIcon
  },
  {
    id: 2,
    label: "Live",
    url: "/", // TODO: Define URL
    Icon: LiveIcon
  },
  {
    id: 3,
    label: "My Bets",
    url: "/mybets",
    Icon: UnionIcon
  },
  {
    id: 4,
    label: "Search",
    url: "/", // TODO: Define URL
    Icon: SearchIcon
  }
];

const FooterNavigationTab: React.FC<FooterNavigationTabProps> = ({
  tabClickHandler,
  currentRoute,
  routeTo,
  Icon,
  label
}) => {
  return (
    <div className={styles.tab} onClick={tabClickHandler(routeTo)}>
      {Icon && (
        <Icon
          fill={currentRoute === routeTo ? "var(--darkGreen)" : "var(--darkLightGrey)"}
        />
      )}
      <div
        className={clsx(styles.tabName, { [styles.active]: currentRoute === routeTo })}
      >
        {label}
      </div>
    </div>
  );
};

const FooterNavigation: React.FC<FooterNavigationProps> = ({
  productId,
  currentRoute,
  betslipItems,
  totalOdds,
  isRelative,
  menuOptions
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  // sets the default menu options
  const [navigationTabs, setNavigationTabs] = React.useState<MenuOption[]>(defaultOptions);

  React.useEffect(() => {
    // only applies isSocialEnabled configuration, when override is not provided by client
    if (!menuOptions) {
      const fetchData = (url: string): any => {
        axios
          .get(url)
          .then((res) => {
            const clientProduct = res?.data?.clientProducts.find(
              (clientProduct: any) => clientProduct.product.id === productId);

            if (clientProduct?.isSocialEnabled) {
              const firstSubmenu = navigationTabs.find(submenu => submenu.id === 1);
              const secondSubmenu = navigationTabs.find(submenu => submenu.id === 2);
              const fourthSubmenu = navigationTabs.find(submenu => submenu.id === 4);

              if (productId === 1) { // sports processing
                if (firstSubmenu) firstSubmenu.label = "Sports";

                if (secondSubmenu) {
                  secondSubmenu.label = "Social";
                  secondSubmenu.url = "/social";
                  secondSubmenu.Icon = SocialIcon;
                }

                if (fourthSubmenu) {
                  fourthSubmenu.label = "Profile";
                  fourthSubmenu.url = "/profile";
                  fourthSubmenu.Icon = ProfileIcon;
                }
              } else if (productId === 2) { // eSports processing
                if (firstSubmenu) firstSubmenu.label = "eSports";

                if (secondSubmenu) {
                  secondSubmenu.label = "Social";
                  secondSubmenu.url = "/social";
                  secondSubmenu.Icon = SocialIcon;
                }

                if (fourthSubmenu) {
                  fourthSubmenu.label = "Profile";
                  fourthSubmenu.url = "/profile";
                  fourthSubmenu.Icon = ProfileIcon;
                }
              }

              setNavigationTabs([...navigationTabs]);
            }
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

      // fetches the client settings
      fetchData(`/client`);
    } else {
      const isIdProvided = menuOptions.every((override: any) => Object.prototype.hasOwnProperty.call(override, "id"));

      menuOptions.forEach((override: any, index: number) => {
        // check id attribute exists, and try overriding it by id, and if not provided, then do it sequentialy
        let submenu;

        if (isIdProvided) {
          submenu = navigationTabs.find(submenu => submenu.id === override.id);
        } else {
          submenu = navigationTabs[index];
        }

        if (submenu && Object.prototype.hasOwnProperty.call(override, "label")) submenu.label = override.label;
        if (submenu && Object.prototype.hasOwnProperty.call(override, "url")) submenu.url = override.url;
        if (submenu && Object.prototype.hasOwnProperty.call(override, "Icon")) submenu.Icon = override.Icon;
      });

      setIsLoading(false);
    }
  }, []);

  const tabClickHandler = (route: string) => () => {
    const switchFooterRoute = new CustomEvent("switch-footer-route", {
      detail: route,
      bubbles: true
    });

    window.dispatchEvent(switchFooterRoute);
  };

  const toggleBetSlipHandler = (): void => {
    const toggleBetSlip = new CustomEvent("open-bet-slip", {
      detail: {
        productId
      },
      bubbles: true
    });

    window.dispatchEvent(toggleBetSlip);
  };

  // TODO: Implement skeleton when dealing with the skeleton task
  if (isLoading) {
    return <a>Loading...</a>;
  };

  return (
    <div className={clsx(styles.root, { [styles.relative]: isRelative })}>
      {navigationTabs.map((tab, index) => {
        return (
          <React.Fragment key={`footer-navigation-${index}`}>
            {index === 2 && (
              <div
                className={clsx(styles.totalBets, {
                  [styles.active]: +betslipItems > 0
                })}
                onClick={toggleBetSlipHandler}
              >
                <cite>{betslipItems}</cite>
                <div>{(Math.floor(+totalOdds * 100) / 100).toFixed(2)}</div>
                <strong>Total Odds</strong>
              </div>
            )}
            <FooterNavigationTab
              key={tab?.id ?? tab.url + tab.label}
              tabClickHandler={tabClickHandler}
              currentRoute={currentRoute}
              routeTo={tab.url}
              Icon={tab?.Icon}
              label={tab.label}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

class Element extends HTMLElement {
  "product-id": number;
  "current-route": string;
  "betslip-items": number;
  "total-odds": number;
  "relative"?: boolean;
  "menu-options"?: MenuOption[];

  constructor() {
    super();

    this["product-id"] = -1;
    this["current-route"] = "/";
    this["betslip-items"] = 0;
    this["total-odds"] = 0;
    this.relative = false;
    this["menu-options"] = undefined;
  }

  connectedCallback(): void {
    createRoot(this).render(
      <FooterNavigation
        productId={this["product-id"]}
        currentRoute={this["current-route"]}
        betslipItems={this["betslip-items"]}
        totalOdds={this["total-odds"]}
        isRelative={this.relative}
        menuOptions={this["menu-options"]}
      />
    );
  }

  static get observedAttributes(): string[] {
    return ["product-id", "current-route", "betslip-items", "total-odds", "relative", "menu-options"];
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string,
    newValue: string
  ): void {
    switch (attrName) {
      case "product-id":
        this[attrName] = Number(newValue);
        break;
      case "current-route":
        this[attrName] = newValue;
        break;
      case "betslip-items":
      case "total-odds":
        this[attrName] = +newValue;
        break;
      case "relative":
      case "menu-options":
        this[attrName] = JSON.parse(newValue);
        break;
      default:
        break;
    }
  }
}

customElements.get("leetent-footer-navigation") ?? customElements.define("leetent-footer-navigation", Element);
