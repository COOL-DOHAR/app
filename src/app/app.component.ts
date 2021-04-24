import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { ThemeService } from './services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { LogService } from './services/log.service';
import devtools from 'devtools-detect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public get sfxEnabled() {
    return localStorage.getItem('sfx') !== 'disabled';
  }

  constructor(
    private themeService: ThemeService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private log: LogService,
  ) {}

  public async ngOnInit() {
    this.route.queryParamMap.subscribe(async(map) => {
      const success = map.get('success');
      const error = map.get('error');
      if (success)
        await this.log.success(success);
      else if (error)
        await this.log.error(error);
    });

    this.themeService.updateTheme();
    await this.userService.updateUser();

    this.consoleWarning();
  }

  private consoleWarning() {
    const interval = setInterval(() => {
      if (!devtools.isOpen) return;

      this.log.consoleWarning();
      clearInterval(interval);
    }, 100);
  }
}
