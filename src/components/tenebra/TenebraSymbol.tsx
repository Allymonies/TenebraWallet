// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import Icon from "@ant-design/icons";

export const TenebraSymbolSvg = (): JSX.Element => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 80 80">
    <path
      //style="stroke-width:0.90271449"
      d="M 7.1816406 4.5117188 L 7.1816406 14.478516 L 31.6875 14.478516 L 31.6875 39.527344 L 14.167969 28.490234 L 7.8144531 38.578125 L 31.679688 53.613281 L 31.6875 53.601562 L 31.6875 91.984375 L 43.601562 91.984375 L 43.601562 53.587891 L 43.625 53.625 L 67.490234 38.587891 L 61.136719 28.501953 L 43.601562 39.548828 L 43.601562 14.478516 L 67.494141 14.478516 L 67.494141 4.5117188 L 7.1816406 4.5117188 z "
      id="rect3737" />
  </svg>

);
export const TenebraSymbol = (props: any): JSX.Element =>
  <Icon component={TenebraSymbolSvg} {...props} />;
