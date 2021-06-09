// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
export interface WhatsNewItem {
  commitHash?: string;
  date: string;
  authorUsername?: string;
  authorName?: string;
  body: string;
  new?: boolean;
}

export interface Commit {
  type?: "feat" | "fix" | string;
  subject?: string;
  body: string;
  hash: string;
  authorName?: string;
  authorEmail?: string;
  authorDate: string;
  authorDateRel: string;
  avatar?: string;
}

export interface WhatsNewResponse {
  whatsNew: WhatsNewItem[];
  commits: Commit[];
}
